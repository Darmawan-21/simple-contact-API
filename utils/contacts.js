
const fs = require('fs')

const dirPath = './data'
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

//Membuat file contacts .json

const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const detailContact = (nama) =>{
    const contats = loadContact();
    const contact = contats.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
    )
    if(!contact){
        return false
    }
}
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
   // console.log(fileBuffer)
    const contacts = JSON.parse(fileBuffer)
    //console.log(contacts)
    return contacts
}

const findContact =(nama) =>{
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact;
}

// Menimpa file contact.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}


// Menambah data kontak baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);;
    saveContacts(contacts);
}

//Cek nama duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama ===nama)
}

const deleteContact = (nama) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama)
    saveContacts(filteredContacts);
}

const updateContacts = (contactBaru) => {
    const contacts = loadContact();
    //hilangkan kontak lama yg namanya sama dengan old nama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldName)
    delete contactBaru.oldName;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts)
}

module.exports = { loadContact, findContact , addContact,  cekDuplikat, deleteContact, updateContacts}