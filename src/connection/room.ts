class Room {
  static async create() {
    const response = await fetch("http://localhost:5000/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await response.json();
  }
}

export default Room;
