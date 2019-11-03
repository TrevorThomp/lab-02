'use strict';

// Navigation Handler
$('nav a').on('click', function() {
  let $pageChoice = $(this).data('tab');
  if ($pageChoice === 'pageOne') {
    Image.displayChoice = 1;
    Image.allImages.length = 0;
    $('optgroup').empty();
    $('#pageOne').empty();
    Image.getJson();
    $('#' + $pageChoice).fadeIn();
  }
  if ($pageChoice === 'pageTwo') {
    Image.displayChoice = 2;
    Image.allImages.length = 0;
    $('optgroup').empty();
    $('#pageOne').empty();
    Image.getJson();
    $('#' + $pageChoice).fadeIn();
  }
})

// Image constructor function
function Image(img) {
  for(let prop in img){
    this[prop] = img[prop];
  }
  // If apostrophes exists, remove
  this.removeApostrophe = this.title.replace(/'/g, '');
  // If whitespace exists, remove
  this.removeSpace = this.removeApostrophe.replace(/ /g, '');
};

// Array that holds Page 1 objects
Image.allImages = [];
Image.displayChoice = 1;

// Handlebar template compiler
Image.prototype.toHtml = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
}

// Select option Render
Image.prototype.selectMenu = function() {
  // Append keywords to specific optgroup
  $('#keyword-option').append(
    $('<option></option>')
      .attr('value', this.keyword)
      .text(this.keyword));

  // Append titles to specific optgroup
  $('#title-option').append(
    $('<option></option>')
      .attr('value', this.removeSpace)
      .text(this.title));

  // Append horns to specific optgroup
  $('#horn-option').append(
    $('<option></option>')
      .attr('value', this.horns)
      .text(this.horns));

  // Loop attributed by https://stackoverflow.com/questions/23729456/how-to-remove-duplicate-dropdown-option-elements-with-same-value
  // Removes duplicate keywords in the select menu
  let usedNames = {};
  $('#form option').each(function () {
    if(usedNames[this.text]) {
      $(this).remove();
    } else {
      usedNames[this.text] = this.value;
    }
  });
};

// Retrieve JSON data from page-1.json and push into array
Image.getJson = () => {
  $.get(`../data/page-${Image.displayChoice}.json`)
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item))
      });
    })
    .then(Image.prototype.loadImages);
};

// Loops through array of images and renders each one
Image.prototype.loadImages = () => {
  Image.allImages.forEach(images => {
    $('#pageOne').append(images.toHtml());
    images.selectMenu();
  })
}

// Displays images based on user selected option
$(`select[name='images'`).on('change', function() {
  let $selectedImage = $(this).val();
  $('section').hide();
  $(`section.${$selectedImage}`).show();
});

// jQuery modal trigger
$('main').on('click', '.sourceImg', function(e) {
  e.preventDefault();
  $('#modalTitle').text($($(this).parent()).find('h2').text());
  $('#modalDesc').text($($(this).parent()).find('p').text());
  $('#modalImg').attr('src', $(this).attr('src'));
  $('#lightbox-modal').fadeIn();
})

// Closes modal on click event
$('#close').on('click', function() {
  $('#lightbox-modal').fadeOut();
})

// Search bar functionality
$('#searchBar').on('keyup', () => {
  const filter = $('#searchBar').val().toUpperCase();
  const section = $('section');

  // Loops through and collects classNames and compares to searchbar value
  for (let i = 0; i < section.length; i++) {
    let sectionInfo = section[i].getAttribute('class');
    if (sectionInfo.toUpperCase().indexOf(filter) > -1) {
      section[i].style.display = '';
    } else {
      section[i].style.display = 'none'
    }
  }
})

// Document ready function
$(document).ready(function() {
  Image.getJson();
});
