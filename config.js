
document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('userList');

  const users = [
    // West Region Technicians
    { name: 'Rajesh Maharaj', district: 'West' },
    { name: 'Keisha Mohammed', district: 'West' },
    { name: 'Anil Persad', district: 'West' },
    { name: 'Shania Williams', district: 'West' },
    
    // East Region Technicians
    { name: 'Ravi Ramsingh', district: 'East' },
    { name: 'Priya Dookie', district: 'East' },
    { name: 'Kevin Boodoo', district: 'East' },
    { name: 'Alicia Singh', district: 'East' },
    
    // Central Region Technicians
    { name: 'Darren Ramjit', district: 'Central' },
    { name: 'Kavita Patel', district: 'Central' },
    { name: 'Marcus Baptiste', district: 'Central' },
    { name: 'Sunita Ramnarine', district: 'Central' },
    
    // South Region Technicians
    { name: 'Adesh Moonsammy', district: 'South' },
    { name: 'Kamala Seepersad', district: 'South' },
    { name: 'Joel Gonzales', district: 'South' },
    { name: 'Reshma Ramdass', district: 'South' }
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
