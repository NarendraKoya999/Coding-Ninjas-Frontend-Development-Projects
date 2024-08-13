// Select elements
const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const previewImg = document.getElementById("preview");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImgBtn = document.querySelector(".save-img");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const slider = document.querySelector(".slider input");

const filterButtons = {
    brightness: document.getElementById("brightness"),
    saturation: document.getElementById("saturation"),
    grayscale: document.getElementById("grayscale"),
    inversion: document.getElementById("inversion")
};

let filters = {
    brightness: 100,
    saturation: 100,
    grayscale: 0,
    inversion: 0
};

let rotate = {
    left: 0,
    right: 0,
    horizontal: 1,
    vertical: 1
};

let currentFilter = 'brightness';

chooseImgBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.classList.remove("disable");
    };
    reader.readAsDataURL(file);
});

slider.addEventListener("input", function() {
    filters[currentFilter] = this.value;
    filterValue.textContent = `${this.value}%`;
    applyFilters();
});

function applyFilters() {
    const brightness = `brightness(${filters.brightness}%)`;
    const saturation = `saturate(${filters.saturation}%)`;
    const grayscale = `grayscale(${filters.grayscale}%)`;
    const inversion = `invert(${filters.inversion}%)`;
    const rotateLeft = `rotate(${rotate.left}deg)`;
    const rotateRight = `rotate(${rotate.right}deg)`;
    const flipHorizontal = `scaleX(${rotate.horizontal})`;
    const flipVertical = `scaleY(${rotate.vertical})`;
    previewImg.style.filter = `${brightness} ${saturation} ${grayscale} ${inversion}`;
    previewImg.style.transform = `${rotateLeft} ${rotateRight} ${flipHorizontal} ${flipVertical}`;
}

Object.keys(filterButtons).forEach(key => {
    filterButtons[key].addEventListener("click", () => {
        currentFilter = key;
        filterName.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        filterValue.textContent = `${filters[key]}%`;
        slider.value = filters[key];
    });
});

document.getElementById("left").addEventListener("click", () => {
    rotate.left -= 90;
    applyFilters();
});

document.getElementById("right").addEventListener("click", () => {
    rotate.right += 90;
    applyFilters();
});

document.getElementById("horizontal").addEventListener("click", () => {
    rotate.horizontal = rotate.horizontal === 1 ? -1 : 1;
    applyFilters();
});

document.getElementById("vertical").addEventListener("click", () => {
    rotate.vertical = rotate.vertical === 1 ? -1 : 1;
    applyFilters();
});

resetFilterBtn.addEventListener("click", () => {
    filters = {
        brightness: 100,
        saturation: 100,
        grayscale: 0,
        inversion: 0
    };
    rotate = {
        left: 0,
        right: 0,
        horizontal: 1,
        vertical: 1
    };
    filterName.textContent = 'Brightness';
    filterValue.textContent = '100%';
    slider.value = 100;
    applyFilters();
});

saveImgBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.filter = previewImg.style.filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2);
    const link = document.createElement("a");
    link.download = "Image.jpg";
    link.href = canvas.toDataURL();
    link.click();
});
