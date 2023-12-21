class User {
    constructor(id, username, email, name, lastname, rank) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.lastname = lastname;
        this.rank = rank;
    }

    getId() { return this.id; }
    
    getUsername() { return this.username; }

    getEmail() { return this.email; }

    getName() { return this.name; }

    getLastname() { return this.lastname; }

    getRank() { return this.rank; }

    // Setters

    setId(id) { this.id = id; }
    
    setUsername(username) { this.username = username; }

    getEmail(email) { this.email = email }

    getName(name) { this.name = name; }

    getLastname(lastname) { this.lastname = lastname; }

    getRank(rank) { this.rank = rank; }
}

module.exports = User;