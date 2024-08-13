const MAX_IMAGES = 5;
const fileList = document.getElementById('fileList');
const inputFile = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const errorMessage = document.getElementById('error-message');
let carouselIndex = 0;

inputFile.addEventListener('change', function (event) {
    handleFiles(Array.from(event.target.files));
});

dropzone.addEventListener('click', () => inputFile.click());

dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(Array.from(event.dataTransfer.files));
});

function handleFiles(files) {
    // Hide previous error messages
    errorMessage.style.display = 'none';
    
    if (files.length + fileList.children.length > MAX_IMAGES) {
        errorMessage.textContent = `You can only upload up to ${MAX_IMAGES} images.`;
        errorMessage.style.display = 'block';
        return;
    }

    let validFiles = false; // Flag to track if at least one file is valid
    files.forEach(file => {
        if (file.type.startsWith('image/') && file.size <= 1048576) {
            validFiles = true; // Set flag to true for valid files
            displayFile(file);
            saveToLocalStorage(file);
        } else {
            // Display error message for invalid file
            errorMessage.textContent = 'File must be an image and less than 1 MB in size.';
            errorMessage.style.display = 'block';
        }
    });
    
    // If no valid files, do not update localStorage or file list
    if (validFiles) {
        updateLocalStorage();
    }
}

function saveToLocalStorage(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const storedImagesData = JSON.parse(localStorage.getItem('storedImagesData') || '[]');
        storedImagesData.push({ src: e.target.result, description: '' });
        localStorage.setItem('storedImagesData', JSON.stringify(storedImagesData));
        updateLocalStorage(); // Update localStorage after saving the new file
    };

    reader.readAsDataURL(file);
}

function updateLocalStorage() {
    const storedImagesData = [];
    const fileNames = document.querySelectorAll('.file-name');
    fileNames.forEach(fileName => {
        const img = fileName.querySelector('img');
        const textarea = fileName.querySelector('textarea');
        storedImagesData.push({ src: img.src, description: textarea.value });
    });
    localStorage.setItem('storedImagesData', JSON.stringify(storedImagesData));
}

function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const div = document.createElement('div');
        div.className = 'file-name';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.className = 'thumbnail';
        div.appendChild(img);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Add a description...'; // Updated placeholder value
        div.appendChild(textarea);

        textarea.addEventListener('input', updateLocalStorage);

        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'delete-icon';
        deleteIcon.textContent = 'Delete';
        div.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', function () {
            div.remove();
            updateLocalStorage();
        });

        fileList.appendChild(div);
    };

    reader.readAsDataURL(file);
}


function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(localStorage.getItem('storedImagesData') || '[]');
    storedImagesData.forEach(data => {
        const div = document.createElement('div');
        div.className = 'file-name';

        const img = document.createElement('img');
        img.src = data.src;
        img.alt = 'Saved Image';
        img.className = 'thumbnail';
        div.appendChild(img);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Add a description';
        textarea.value = data.description;
        div.appendChild(textarea);

        textarea.addEventListener('input', updateLocalStorage);

        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'delete-icon';
        deleteIcon.textContent = 'Delete';
        div.appendChild(deleteIcon);

        deleteIcon.addEventListener('click', function () {
            div.remove();
            updateLocalStorage();
        });

        fileList.appendChild(div);
    });
}

function startCarousel() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    setInterval(() => {
        carouselItems.forEach((item, index) => {
            item.style.transform = `translateX(-${carouselIndex * 100}%)`;
        });
        carouselIndex = (carouselIndex + 1) % carouselItems.length;
    }, 3000); // Adjust the interval time as needed
}

// Load images from localStorage on page load
window.addEventListener('load', () => {
    loadFromLocalStorage();
    startCarousel();
});
