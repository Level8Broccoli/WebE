export class Player {
  public id: string;
  public name: string;
  public secret: string;

  constructor(id: string, name: string, secret: string) {
    this.id = id;
    this.name = name;
    this.secret = secret;
  }
}
