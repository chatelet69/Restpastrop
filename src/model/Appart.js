class Appart {
    constructor(id, title, ...any) {
        this.id = id;
        this.title = title;
        for (const arg of any) this.arg = arg;
    };

    // Getters

    getId() { return this.id; }

    getTitle() { return this.title; }

    getStatus() { return this.status; }

    getPrice() { return this.price; }

    getOwner() { return this.owner; }

    getAddress() { return this.address; }

    // Setters 

    setId(newId) { this.id = newId; }

    setTitle(newTitle) { this.title = newTitle; }

    setStatus(newStatus) { this.status = newStatus; }

    setPrice(newPrice) { this.price = newPrice; }

    setOwner(newOwner) { this.owner = newOwner; }

    setAddress(newAddress) { this.address = newAddress; }
}

module.exports = new Appart();