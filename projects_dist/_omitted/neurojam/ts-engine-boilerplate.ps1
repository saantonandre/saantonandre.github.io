$Folder = "./ts-engine-boilerplate"

function CreateBoilerplate {
	Write-Output "Checking if $Folder exists..."
 	if (Test-Path -Path $Folder){
		Read-Host "Folder $Folder already exists`npress Enter key to continue"
		return "You can close this window"
	}
	Write-Output "Downloading from repository..."
	git clone git@github.com:saantonandre/ts-engine-boilerplate.git
	Set-Location $folder
	Write-Output "Opening Visual Studio..."
	Write-Output "Installing packages..."
	yarn	
	code .
	return "You can close this window"
}
CreateBoilerplate