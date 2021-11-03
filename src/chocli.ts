import Shell from "node-powershell";

export interface IChocli {}

export class Chocli implements IChocli {
  ps: Shell;
  chocoVersion: string | undefined;
  constructor() {
    this.ps = new Shell({
      executionPolicy: "Bypass",
      noProfile: true,
    });
    this.setup();
  }

  async setup(): Promise<void> {
    if (await this.isInstalled()) {
      console.log("Installed...");
      await this.verifyAndUpdate();
      console.log("Updated...");
    } else {
      console.log("Chocolatey is not installed. Installing...");
      await this.install();
    }
  }

  async isInstalled(): Promise<boolean> {
    this.ps.addCommand("choco -v");

    try {
      const output = await this.ps.invoke();
      this.chocoVersion = output;
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async install(): Promise<void> {
    this.ps.addCommand(
      "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    );
    try {
      await this.ps.invoke();
    } catch (err) {
      console.log("Error during installation. Please try manually", err);
    }
  }

  async verifyAndUpdate(): Promise<void> {
    try {
      console.log("Verifying Chocolatey...");
      this.ps.addCommand("choco upgrade chocolatey");
      this.ps.addCommand("y");
      console.log(this.ps.invoke());
    } catch (err) {
      console.log("Error during update", err);
    }
  }
}
