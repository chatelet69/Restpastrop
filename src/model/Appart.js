class Appart {
    constructor(id, title, wifi = null, parking = null, childAdapted = null, balcon = null, smoker = null, ...any) {
        this.id = id;
        this.title = title;
        spec = array();
        this.spec['wifi'] = wifi;
        this.spec['parking'] = parking;
        this.spec['childAdapted'] = childAdapted;
        this.spec['balcon'] = balcon;
        this.spec['smoker'] = smoker;

        for (const arg of any) this.arg = arg;
    };

    // Getters

    getId() { return this.id; }

    getSpec() {return this.spec;}

    getTitle() { return this.title; }

    getStatus() { return this.status; }

    getPrice() { return this.price; }

    getOwner() { return this.owner; }

    getAddress() { return this.address; }

    getRooms() {return this.nbRooms;}

    getPersonCount() {return this.PersonCount;}

    // Setters 

    setId(newId) { this.id = newId; }

    setSpec(...any) { for (const arg of any) this.spec[arg] = arg;}

    setTitle(newTitle) { this.title = newTitle; }

    setStatus(newStatus) { this.status = newStatus; }

    setPrice(newPrice) { this.price = newPrice; }

    setOwner(newOwner) { this.owner = newOwner; }

    setAddress(newAddress) { this.address = newAddress; }

    setRooms(nbRooms) { this.nbRooms = nbRooms;}

    setPersonCount(PersonCount) { this.PersonCount = PersonCount;}

}

module.exports = new Appart();