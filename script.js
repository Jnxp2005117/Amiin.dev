document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('downloadModal');
    const fileNameSpan = document.getElementById('fileName');
    const fileSizeSpan = document.getElementById('fileSize');
    const confirmBtn = document.getElementById('confirmDownload');
    const cancelBtn = document.getElementById('cancelDownload');
    const closeBtn = document.querySelector('.close-modal');
    
    // Current file being downloaded
    let currentFile = null;
    
    // Get search elements
    const searchInput = document.querySelector('.search-bar input');
    const fileCards = document.querySelectorAll('.file-card');
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchQuery = this.value.trim().toLowerCase();
        
        // Filter file cards based on search query
        fileCards.forEach(card => {
            const fileName = card.querySelector('h3').textContent.toLowerCase();
            const fileType = card.querySelector('p').textContent.toLowerCase();
            
            // Check if the card matches the search query
            const matchesSearch = fileName.includes(searchQuery) || fileType.includes(searchQuery);
            
            // Show or hide the card based on the search
            card.style.display = matchesSearch ? 'block' : 'none';
        });
        
        // Show no results message if no matches
        const hasVisibleCards = [...fileCards].some(card => card.style.display !== 'none');
        
        let noResultsMsg = document.querySelector('.no-results-message');
        if (!hasVisibleCards && searchQuery !== '') {
            // Create no results message if it doesn't exist
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.textContent = 'No matching files found';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.marginTop = '40px';
                noResultsMsg.style.width = '100%';
                noResultsMsg.style.color = 'var(--gray)';
                noResultsMsg.style.fontSize = '16px';
                document.querySelector('.file-grid').appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    });
    
    // Add clear search when user clicks X or presses ESC
    const searchBar = document.querySelector('.search-bar');
    const clearSearch = document.createElement('i');
    clearSearch.className = 'fas fa-times clear-search';
    clearSearch.style.display = 'none';
    clearSearch.style.position = 'absolute';
    clearSearch.style.right = '40px';
    clearSearch.style.top = '50%';
    clearSearch.style.transform = 'translateY(-50%)';
    clearSearch.style.color = 'var(--gray)';
    clearSearch.style.cursor = 'pointer';
    searchBar.appendChild(clearSearch);
    
    // Show/hide clear button based on input
    searchInput.addEventListener('input', function() {
        clearSearch.style.display = this.value ? 'block' : 'none';
    });
    
    // Clear search when clicked
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        clearSearch.style.display = 'none';
        searchInput.focus();
    });
    
    // Clear search on ESC key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            clearSearch.style.display = 'none';
        }
    });
    
    // Add click event to all download buttons
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the card click event
            
            // Get file data from button attributes
            const fileName = this.getAttribute('data-file');
            const fileSize = this.getAttribute('data-size');
            
            // Set current file
            currentFile = fileName;
            
            // Update modal content
            fileNameSpan.textContent = fileName;
            fileSizeSpan.textContent = fileSize;
            
            // Show modal
            modal.style.display = 'flex';
        });
    });
    
    // Make entire card clickable
    fileCards.forEach(card => {
        card.addEventListener('click', function() {
            const button = this.querySelector('.download-btn');
            if (button) {
                button.click();
            }
        });
    });
    
    // Handle confirm download
    confirmBtn.addEventListener('click', function() {
        // Start actual download of the file
        startDownload(currentFile);
        
        // Close modal
        modal.style.display = 'none';
    });
    
    // Handle cancel and close buttons
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Function to start actual download
    function startDownload(fileName) {
        // Create a link to the zip file
        const link = document.createElement('a');
        link.href = `Folders/${fileName}.zip`;
        link.download = `${fileName}.zip`;
        
        // Add to DOM, click it, then remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download notification
        showNotification(fileName);
    }
    
    // Function to show notification
    function showNotification(fileName) {
        // Create a notification element
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Download started: ${fileName}</span>
            </div>
        `;
        
        // Add styles dynamically
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#1f1f1f';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        // Style for the content
        const content = notification.querySelector('.notification-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        content.style.gap = '12px';
        
        // Style for the icon
        const icon = notification.querySelector('i');
        icon.style.color = 'var(--secondary)';
        icon.style.fontSize = '20px';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(20px)';
            notification.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.download-btn, .modal-footer button, .close-modal');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.2s ease';
            this.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        element.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
    });
}); 