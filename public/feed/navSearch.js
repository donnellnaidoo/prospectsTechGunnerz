async function searchNavUsers() {
    const searchTerm = document.getElementById('nav-search').value;
    const resultsContainer = document.getElementById('searchResultsNav');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (searchTerm.length < 2) {
      return; // Only search if the term is at least 2 characters long
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const users = await response.json();

      if (users.length === 0) {
        resultsContainer.innerHTML = '<p class="list-group-item">No users found</p>';
      } else {
        users.forEach(user => {
          const userItem = document.createElement('a');
          userItem.href = `/profile/${user._id}`;
          userItem.classList.add('list-group-item', 'list-group-item-action');
          const profilePictureUrl = user.profilePicture ? `/uploads/${user.profilePicture}` : 'default-profile-pic-url';
          
          userItem.innerHTML = `
            <img src="${profilePictureUrl}" alt="${user.name}">
            <div class="user-info">
              <span class="user-name">${user.name}</span>
              <span class="user-email">${user.email}</span>
            </div>
          `;

          resultsContainer.appendChild(userItem);
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };