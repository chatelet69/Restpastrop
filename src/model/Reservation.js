class Reservation {
    constructor(id, clientId, appartId, startDate, endDate, status) {
        this.id = id;
        this.clientId = clientId;
        this.appartId = appartId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    };

    getId() { return this.id; }

    getClientId() { return this.clientId; }

    getAppartId() { return this.appartId; }

    getStartDate() { return this.startDate; }

    getEndDate() { return this.endDate; }

    getStatus() { return this.status; }

    getId() { return this.id; }

    // Setter

    setClientId(clientId) { this.clientId = clientId; }

    setAppartId(appartId) { this.appartId = appartId; }

    setStartDate(start) { this.startDate = start; }

    setEndDate(end) { this.endDate = end; }

    setStatus(status) { this.status = status; }
}

module.exports = Reservation;