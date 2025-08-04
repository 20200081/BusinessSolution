document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');

  const users = [
    { name: 'John Doe', district: 'West' },
    { name: 'Jane Smith', district: 'East' },
    { name: 'Mark Johnson', district: 'Central' },
    { name: 'Emily Brown', district: 'South' },
    { name: 'Michael Davis', district: 'West' },
    { name: 'Lisa Wilson', district: 'East' },
    { name: 'Robert Miller', district: 'Central' },
    { name: 'Jessica Lee', district: 'South' }
    // Add more as needed
  ];

  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';

    const name = document.createElement('div');
    name.className = 'user-name';
    name.textContent = `Name: ${user.name}`;

    const district = document.createElement('div');
    district.className = 'user-district';
    district.textContent = `District: ${user.district}`;

    card.appendChild(name);
    card.appendChild(district);
    userList.appendChild(card);
  });
});
