'use strict';

// Navigation Handler
$('nav a').on('click', function() {
  let $pageChoice = $(this).data('tab');
  $('.tab-content').hide();
  $('#' + $pageChoice).fadeIn();
})

// Image constructor function
function Image(img) {
  this.image_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
  // If apostrophes exists, remove
  this.removeApostrophe = this.title.replace(/'/g, '');
  // If whitespace exists, remove
  this.removeSpace = this.removeApostrophe.replace(/ /g, '');
}

// Array that holds Page 1 objects
Image.allImagesPageOne = [];
// Array that holds Page 2 objects
Image.allImagesPageTwo = [];

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
Image.getJsonPageOne = () => {
  $.get('../data/page-1.json')
    .then(data => {
      data.forEach(item => {
        Image.allImagesPageOne.push(new Image(item))
      });
    })
    .then(Image.loadImagesPageOne);
};

// Retrieve JSON data from page-2.json and push into array
Image.getJsonPageTwo = () => {
  $.get('../data/page-2.json')
    .then(data => {
      data.forEach(item => {
        Image.allImagesPageTwo.push(new Image(item))
      });
    })
    .then(Image.loadImagesPageTwo);
};

// Loops through array of images and renders each one
Image.loadImagesPageOne = () => {
  Image.allImagesPageOne.forEach(images => {
    images.selectMenu();
    $('#pageOne').append(images.toHtml());
  })
}

// Loops through array of images and renders each one
Image.loadImagesPageTwo = () => {
  Image.allImagesPageTwo.forEach(images => {
    images.selectMenu();
    $('#pageTwo').append(images.toHtml());
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
  let imgSource = $(this).attr('src');
  let imgParent = $(this).parent();
  let modalTitle = $(imgParent).find('h2').text();
  let modalDesc = $(imgParent).find('p').text();
  $('#modalTitle').text(modalTitle);
  $('#modalDesc').text(modalDesc);
  $('#modalImg').attr('src', imgSource);
  $('#lightbox-modal').fadeIn();
})

// Closes modal on click event
$('#close').on('click', function() {
  $('#lightbox-modal').fadeOut();
})

// Document ready function
$(document).ready(function() {
  Image.getJsonPageOne();
  Image.getJsonPageTwo();
  $('.tab-content').hide();
});
