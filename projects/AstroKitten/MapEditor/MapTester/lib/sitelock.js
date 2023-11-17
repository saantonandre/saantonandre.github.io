/* Simple sitelock. Needs to be obfuscated by 3rd party tools (like obfuscator.io)

    the encode:
    a2hex(btoa(btoa(a2hex(btoa("string")))))

    the decode:
    atob(hex2a(atob(atob(hex2a(this.a[i])))))

*/
var SL = {

    // Encoded domains goes here:
    a: [],
    // Access Granted boolean
    aG: false,
    compare: function () {
        // Compares the current host with the allowed, encoded hosts.
        let host = window.location.hostname;
        
        // If someone changes the ag variable prior to the compare function, it gets inverted.
        if(this.aG){
            this.aG = !this.aG;
        }
        
        for (let i = 0; i < this.a.length; i++) {
            if (host.search(atob(hex2a(atob(atob(hex2a(this.a[i])))))) !== -1) {
                this.aG = !this.aG;
            }
        }
    }
}

// Converts hexadecimal to normal
function hex2a(hexx) {
    var hex = hexx.toString(); 
    var str = '';
    for (var i = 0;
        (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// Converts normal to hexadecimal (Use it to encode but do not put in the script)
function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}