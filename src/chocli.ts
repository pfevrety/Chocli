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
    console.log(await this.isInstalled())
    if (await this.isInstalled()) {
      console.log("Installed...");
      await this.verifyAndUpdate();
    } else {
      console.log("Chocolatey is ot installed. Installing...");
      await this.install();
    }
  }

  async isInstalled(): Promise<boolean> {
    this.ps.addCommand("choco -v");

    try {
      const output = await this.ps.invoke();
      this.chocoVersion = output;

      console.log(output);
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
      console.log("Error during installation", err);
    }
  }

  async verifyAndUpdate(): Promise<void> {
    try {
      this.ps.addCommand("choco upgrade chocolatey");
      console.log(await this.ps.invoke());
    } catch (err) {
      console.log("Error during update", err);
    }
  }
}
