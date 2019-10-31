'use strict';

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

Image.allImages = [];

Image.prototype.toHtml = function() {
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
}

// Image render function
Image.prototype.render = function() {
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

// Retrieve JSON data and push into array
Image.getJson = () => {
  $.get('../data/page-1.json')
    .then(data => {
      data.forEach(item => {
        Image.allImages.push(new Image(item))
      });
    })
    .then(Image.loadImages);
  console.log(Image.loadImages())
};

// Loops through array of images and renders each one
Image.loadImages = () => {
  Image.allImages.forEach(images => {
    images.render();
    $('main').append(images.toHtml());
  })
}

// Displays images based on user selected option
$(`select[name='images'`).on('change', function() {
  let $selectedImage = $(this).val();
  $('section').hide();
  $(`section.${$selectedImage}`).show();
});

// jQuery lightbox trigger
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

$('#close').on('click', function() {
  $('#lightbox-modal').fadeOut();
})

// Document ready function
$(() => Image.getJson());
