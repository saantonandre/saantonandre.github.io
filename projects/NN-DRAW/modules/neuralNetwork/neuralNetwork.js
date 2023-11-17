import { Layer } from './layer.js';

export class NeuralNetwork {
    /** Creates a new instance of a neural network */
    constructor() {
        /**
         * @type {Layer}
         */
        this.inputLayer;

        /**
         * @type {Layer[]}
         */
        this.hiddenLayers;

        /**
         * @type {Layer}
         */
        this.outputLayer;

        /** Represents the impact of errors over the back propagation */
        this.learningRate = 0.0001;

        /** Init parameters */
        this.initParams = [];

        /**
         * An array containing a reference to each layer of the network
         * @type {Layer[]}
         */
        this.layers = [];


        /**
         * The accuracy of the current nn
         * @type {Number}
         */
        this.currentAccuracy = 0;

        /**
         * The accuracy of the loaded nn settings
         * @type {Number}
         */
        this.saveAccuracy = 0;

        /**
         * The accuracy of the loaded nn settings
         * @type {Number}
         */
        this.randomRange = 10;

    }
    /** The layers returned as a single array */
    get layersArray() {
        return [this.inputLayer, ...this.hiddenLayers, this.outputLayer];
    }
    saveSettings() {
        console.log(JSON.stringify(new Settings(this)))
    }
    /**
     * @param {Settings} settings
     */
    loadSettings(settings) {
        this.initialize(...settings.initParams);
        this.learningRate = settings.learningRate;
        this.saveAccuracy = settings.accuracy;
        for (let i = 0; i < this.layers.length; i++) {
            for (let j = 0; j < this.layers[i].nodes.length; j++) {
                this.layers[i].nodes[j].bias = settings.layersBiases[i][j];
                for (let k = 0; k < this.layers[i].nodes[j].forwardLinks.length; k++) {
                    this.layers[i].nodes[j].forwardLinks[k].weight = settings.layersWeights[i][j][k];
                }
            }
        }
        console.log("The loaded settings have been applied");
    }
    /** 
     * Initializes the layers by adding a specified amount of perceptrons
     *  
     * @param {Number} [inputNodes] Amount of inputs
     * @param {Number[]} [hiddenNodes] Array of numbers, each representing the amount of perceptrons
     * @param {Number} [outputNodes] Amount of outputs
     * @example
     * // Generates a neural network composed of an input layer with 2 neurons, 2 hidden layers with respectively 4 and 3 neurons, an output layer with one neuron:
     * initialize(2,[4,3],1);
     * 
     */
    initialize(inputNodes = 2, hiddenNodes = [2], outputNodes = 1) {
        this.initParams = [inputNodes, hiddenNodes, outputNodes];
        // Creates the layers
        this.inputLayer = new Layer(inputNodes);

        this.hiddenLayers = [];
        hiddenNodes.forEach(perceptronsAmount => { this.hiddenLayers.push(new Layer(perceptronsAmount)) });

        this.outputLayer = new Layer(outputNodes);

        // Links the layers
        this.inputLayer.link(this.hiddenLayers[0]);
        for (let i = 0; i < this.hiddenLayers.length - 1; i++) {
            this.hiddenLayers[i].link(this.hiddenLayers[i + 1]);
        }
        this.hiddenLayers[this.hiddenLayers.length - 1].link(this.outputLayer);
        this.layers = this.layersArray;
        this.randomize(this.randomRange);
    }

    /** Initializes every weight as a random amount 
     * 
     * @param {Number} range The amount will be a random value between -range/2 and range/2
     */
    randomize(range) {
        this.layers.forEach(layer => {
            layer.nodes.forEach(perceptron => {
                perceptron.forwardLinks.forEach(link => {

                    link.weight = Math.random() * range - (range / 2);
                    // link.weight += link.weight > 0 ? range / 2 : -range / 2;
                    // link.weight = Math.random() > 0.5 ? range : -range
                })
            })
        })
    }

    /** Returns the layer before the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    prevLayer(layer) {
        return this.layers[this.layers.indexOf(layer) - 1];
    }

    /** Returns the layer after the given one 
     * 
     * @param {Layer} layer
     * @returns {Layer}
     */
    nextLayer(layer) {
        return this.layers[this.layers.indexOf(layer) + 1];
    }

    /**
     * Feeds the inputs to pass through the network
     * 
     * @param {Number[]} inputs An array of values to pass through the network
     * @returns {Number[]} The output layer's values
     */
    feedForward(inputs) {
        let layers = this.layers;

        layers.forEach(layer => {
            if (layer === this.inputLayer) {
                layer.set(inputs);
            } else {
                layer.computeSums();
                layer.addBiases();
                layer.computeActivations();
            }
        })

        return this.outputLayer.values;
    }

    /**
     * Given a layer and its correct expected output, computes the error and propagates it backwards through each layer
     * This is a recursive function which will terminate once arrived back to the input layer
     * 
     * @param {Layer} layer The layer computing the error
     * @param {Number[]} targets The expected answer to compare with the output's guess
     * @param {Number} learningRate The ratio of the impact of the error over the biases/weights
     * 
     * @returns {Boolean} True when the recursion ends 
     */
    backPropagation(layer, targets, learningRate = this.learningRate) {
        layer.getErrors(targets);
        if (layer === this.inputLayer) {
            return true; // The input layer doesn't back-propagate
        }
        layer.tweak(learningRate);
        this.backPropagation(this.prevLayer(layer), targets)
    }

    /**
     * Trains this neural network for a given amount of cycles
     *      
     * @param {Object[]} dataset The dataset with which this neural network will be trained
     * @param {Number} iterations The amount of cycles
     * 
     * @returns {Number} Accuracy of the latter 1000 tests
     */
    train(dataset, iterations, log = false) {
        console.log("Starting the training...");
        let random = 0;
        let correctGuesses = 0;
        let latterGuesses = 0;
        let accuracyCount = iterations > 1000 ? 1000 : iterations;

        const timeStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            random = Math.random() * dataset.length | 0;
            let guess = this.feedForward(dataset[random].inputs);
            this.backPropagation(this.outputLayer, dataset[random].targets, this.learningRate);

            // Counts the correct guesses
            //[index, amount]
            let numGuess = [0, 0];
            guess.forEach((g, i) => {
                if (g > numGuess[1]) {
                    numGuess[0] = i;
                    numGuess[1] = g;
                }
            })
            let numTarget = dataset[random].targets.indexOf(1);
            //console.log(numTarget, numGuess[0])
            let correct = numGuess[0] === numTarget;
            if (correct) {
                correctGuesses++;
                if (i >= iterations - accuracyCount) {
                    latterGuesses++;
                }
            }
            if (!(i % 1000)) {
                console.log(`Trained for ${i} iterations...\nCurrent Accuracy: ${(correctGuesses/i*100).toFixed(2)}%`)
            }
            // this.learningRate *= 0.9999999;
        }

        const timeEnd = performance.now();
        // logs the accuracy on the console
        let accuracyAll = correctGuesses / iterations * 100;
        let accuracyLatter = latterGuesses / accuracyCount * 100;
        this.currentAccuracy = accuracyAll;
        this.saveSettings();
        if (log) {
            console.log(`Trained for ${iterations} iterations.\n\nAccuracy: 
            ${accuracyAll.toFixed(2)}% (overall)
            ${accuracyLatter.toFixed(2)}% (last ${accuracyCount} iterations)
            Time per 1000 iterations: ${((timeEnd-timeStart)/1000/iterations*1000).toFixed(2)}
            Accuracy Change: ${(this.currentAccuracy-this.saveAccuracy).toFixed(2)}
            Current Learning rate: ${this.learningRate}`);
        }
        return accuracyLatter;
    }
}
class Settings {
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    constructor(nn) {
        this.initParams = nn.initParams;
        this.learningRate = nn.learningRate;
        this.accuracy = nn.currentAccuracy;
        this.layersBiases = this.getBiases(nn);
        this.layersWeights = this.getWeights(nn);
    }
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    getBiases(nn) {
        let layers = [];
        for (let i = 0; i < nn.layers.length; i++) {
            let biases = [];
            for (let j = 0; j < nn.layers[i].nodes.length; j++) {
                biases.push(nn.layers[i].nodes[j].bias);
            }
            layers.push(biases);
        }
        return layers;
    }
    /**
     * 
     * @param {NeuralNetwork} nn 
     */
    getWeights(nn) {
        let layers = [];
        for (let i = 0; i < nn.layers.length; i++) {
            let nodes = [];
            for (let j = 0; j < nn.layers[i].nodes.length; j++) {
                let weights = [];
                for (let k = 0; k < nn.layers[i].nodes[j].forwardLinks.length; k++) {
                    weights.push(nn.layers[i].nodes[j].forwardLinks[k].weight);
                }
                nodes.push(weights);
            }
            layers.push(nodes);
        }
        return layers;
    }
}