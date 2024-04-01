<script>
    document.addEventListener('DOMContentLoaded', function() {
        const inputText = document.getElementById('inputText');
        const fontType = document.getElementById('fontType');
        const colorPicker = document.getElementById('colorPicker');
        const clearBtn = document.getElementById('clearBtn');
        const signatureList = document.getElementById('signatureList');
        const colorButtons = document.querySelectorAll('.color-btn');
        const previewButtons = document.querySelectorAll('.preview-btn');
        const downloadBtn = document.getElementById('downloadPreview');
        const emailInput = document.getElementById('email');
        const drawSignatureModalCloseHandler = document.getElementById('drawSignatureModalCloseHandler');

        let selectedFontFamily = '';

        const serifFonts = [
            'Bad Script', 'Bilbo Swash Caps', 'Caveat', 'Covered By Your Grace',
            'Dancing Script', 'La Belle Aurore', 'Marck Script', 'Nothing You Could Do', 'Stalemate'
        ];

        const sansSerifFonts = [
            'Dm Sans', 'Dosis', 'Inter', 'Karla', 'Lato', 'Manjari', 'Monrope', 'Montserrat Subrayada', 'Mulish'
        ];

        function generateSignatures() {
            signatureList.innerHTML = '';
            const text = inputText.value.trim();
            const color = colorPicker.value;
            const selectedFont = fontType.value;

            let fontsToUse = [];
            if (selectedFont === 'handwriting') {
                fontsToUse = serifFonts;
            } else if (selectedFont === 'sans-serif') {
                fontsToUse = sansSerifFonts;
            }

            if (text.length > 0) {
                fontsToUse.forEach(font => {
                    const signatureItem = document.createElement('div');
                    signatureItem.classList.add('signature-item');

                    const header = document.createElement('div');
                    header.classList.add('header');

                    const signatureTitle = document.createElement('div');
                    signatureTitle.classList.add('signature-title');
                    signatureTitle.textContent = font;
                    header.appendChild(signatureTitle);

                    const signature = document.createElement('div');
                    signature.style.fontFamily = font;
                    signature.style.fontSize = '56.25px';
                    signature.textContent = text;
                    signature.style.color = color;
                    signature.classList.add('signature-description');
                    header.appendChild(signature);

                    signatureItem.appendChild(header);

                    const footer = document.createElement('div');

                    const previewButton = document.createElement('button');
                    previewButton.textContent = 'Download Signature';
                    previewButton.classList.add('preview-btn');
                    footer.appendChild(previewButton);

                    signatureItem.appendChild(footer);

                    signatureList.appendChild(signatureItem);

                    previewButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        selectedFontFamily = font;
                        const previewText = document.createElement('div');
                        previewText.style.fontFamily = font;
                        previewText.style.fontSize = '104px';
                        previewText.style.color = color;
                        previewText.textContent = text;
                        const previewModal = document.getElementById('previewModal');
                        const modalContent = previewModal.querySelector('.modal-content');
                        modalContent.innerHTML = '';
                        modalContent.appendChild(previewText);
                        previewModal.style.display = 'block';
                    });
                });
            }

            if (signatureList.children.length > 0) {
                signatureList.classList.add('visible');
            } else {
                signatureList.classList.remove('visible');
            }
        }

    

      function generatePNG(text, font, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const width = 888; // Set the width to 888px
        const height = 238; // Set the height to 238px
        const fontSize = 66.25; // Increase the font size by 10px

        canvas.width = width;
        canvas.height = height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.font = `${fontSize}px ${font}`;

        // Calculate the text width
        const textWidth = context.measureText(text).width;

        // Calculate the x-coordinate for centering the text
        const x = (width - textWidth) / 2;

        // Calculate the y-coordinate for vertically centering the text
        const y = height / 2 + fontSize / 3;

        // Draw the text at the calculated position
        context.fillText(text, x, y);

        return canvas;
      }
        
        // Initially disable the download button
      downloadBtn.disabled = true;
      downloadBtn.style.opacity = "0.5";
      downloadBtn.style.cursor = "not-allowed";

     emailInput.addEventListener('input', function() {
    if (!emailInput.value.trim() || (emailInput.value.length && validateEmail(emailInput.value.trim()))) {
        // Enable the download button if the email is empty or valid
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = "1";
        downloadBtn.style.cursor = "pointer";
    } else {
        // Disable the download button if the email is not valid
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = "0.5";
        downloadBtn.style.cursor = "not-allowed";
    }
});

        downloadBtn.addEventListener('click', function(event) {
            event.preventDefault();
             if (!validateEmail(emailInput.value.trim())) {
                  return;
              }

            const text = inputText.value.trim();
            const color = colorPicker.value;
            const canvas = generatePNG(text, selectedFontFamily, color);

            const dataUrl = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${inputText.value}-signature.png`;

            link.click();
        });
        
            function validateEmail(email) {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
        
        clearBtn.addEventListener('click', function() {
          // Clear the input field
          inputText.value = '';

          // Reset the color to default (black)
          colorPicker.value = '#000000';

          // Reset the font type option to default (handwriting)
          fontType.value = 'handwriting';
          // Regenerate signatures
          generateSignatures();
      });
        drawSignatureModalCloseHandler.addEventListener('click', function() {
        // Clear the email input field
        inputText.value = '';
        emailInput.value = '';
 // Reset the color to default (black)
          colorPicker.value = '#000000';

          // Reset the font type option to default (handwriting)
          fontType.value = 'handwriting';
        // Reset the styling of the download button
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = "0.5";
        downloadBtn.style.cursor = "not-allowed";
         
          // Regenerate signatures
          generateSignatures();
      
});

        inputText.addEventListener('input', generateSignatures);
        fontType.addEventListener('change', generateSignatures);
        colorPicker.addEventListener('input', generateSignatures);
        colorButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonColor = button.style.backgroundColor;
                const hexColor = rgbToHex(buttonColor);
                colorPicker.value = hexColor;
                generateSignatures();
            });
        });

        function rgbToHex(rgb) {
            const [r, g, b] = rgb.match(/\d+/g);
            return "#" + ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1);
        }

        generateSignatures();
    });
</script>



<div class='anchor' id='conclusion'></div>

Things to Keep in Mind While Getting Editing Software 