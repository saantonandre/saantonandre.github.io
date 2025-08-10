const users = [];

let idCounter = 0;

window.addUser = (name, surname) => {
  const user = { name: name, surname: surname, id: idCounter };
  idCounter = idCounter + 1;
  users.push(user);
  console.log("New user created:", user);
};

window.deleteUser = (id) => {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.id === id) {
      users.splice(i, 1);
      console.log("User deleted", user);
      return;
    }
  }
  console.log("User not found");
};

window.updateProperty = (id, property, value) => {
  for (const user of users) {
    if (user.id === id) {
      user[property] = value;
      console.log(user);
      return;
    }
  }
  console.log("User not found");
};
window.list = () => {
  console.log("Lista utenti:", users);
};
