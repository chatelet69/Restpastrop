class Appart {
    constructor(id, title, ...any) {
        this.id = id;
        this.title = title;

        for (const arg of any) this.arg = arg;
    };

    // Getters

    getId() { return this.id; }

    getSpec() {return this.spec;}

    getChildAdapted() {return this.childAdapted;}

    getWifi() {return this.wifi;}

    getParking() {return this.parking;}

    getBalcon() {return this.balcon;}

    getSmoker() {return this.smoker;}

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

    setChildAdapted(childAdapted) { this.childAdapted = childAdapted;}

    setWifi(wifi) { this.wifi= wifi;}

    setParking(parking) { this.parking= parking;}

    setBalcon(balcon) { this.balcon= balcon;}

    setSmoker(smoker) { this.smoker= smoker;}

    setTitle(newTitle) { this.title = newTitle; }

    setStatus(newStatus) { this.status = newStatus; }

    setPrice(newPrice) { this.price = newPrice; }

    setOwner(newOwner) { this.owner = newOwner; }

    setAddress(newAddress) { this.address = newAddress; }

    setRooms(nbRooms) { this.nbRooms = nbRooms;}

    setPersonCount(PersonCount) { this.PersonCount = PersonCount;}

}

module.exports = new Appart();