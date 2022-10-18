class Room {
  private constructor() {}

  static async create() {
    const response = await fetch("http://localhost:5000/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }
}

export default Room;
