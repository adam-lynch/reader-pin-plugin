
export default (ReadwisePluginElement) => ({
  name: 'pin-plugin',
  Element: class PinPluginElement extends ReadwisePluginElement {
    connectedCallback() {
      const button = document.createElement('button');
      button.innerText = 'Pin';
      const rootStyle = document.createElement('style');
      rootStyle.innerText = `
      button {
        margin-right: 10px;
        border-radius: 8px;
        height: 32px;
        border: 0;
        cursor: pointer;
      }
      `;
      this.appendChild(rootStyle);
      button.addEventListener('click', () => {
        const isPinned = button.innerText === 'Unpin';
        if (isPinned) {
          button.innerText = 'Pin';
          document.getElementById('pin-container')?.remove();

          const wrapper = document.querySelector('#document-reader-root div[class^="_textContentWrapper"]');
          if (!wrapper) {
            throw new Error("Can't find wrapper");
          }
          wrapper.style.paddingTop = '0px';
        } else {
          button.innerText = 'Unpin';

          const pinContainer = document.createElement('div');
          pinContainer.id = 'pin-container';
          const style = document.createElement('style');
          style.innerText = `
          #pin-container {
            position: fixed;
            top: 0;

            padding: 50px 10px 10px;
            max-height: 250px;

            overflow-y: auto;

            background: white;
            box-shadow: 0 9px 9px -9px rgb(0 0 0 / 15%);
          }

          #pin-container::-webkit-scrollbar {
            height: unset !important;
            width: unset !important;
          }

          #pin-container ::-webkit-scrollbar {
            height: unset !important;
            width: unset !important;
          }
        `;
          pinContainer.appendChild(style);

          const wrapper = document.querySelector('#document-reader-root div[class^="_textContentWrapper"]');
          if (!wrapper) {
            throw new Error("Can't find wrapper");
          }

          
          const rect = wrapper.getBoundingClientRect();
          pinContainer.style.left = `${rect.left}px`;
          pinContainer.style.width = `${rect.width}px`;
          
          const target = document.querySelector('.js_contentFocusIndicator_focusedTarget');
          const targetRect = target.getBoundingClientRect();
          pinContainer.style.height = (Math.min(200, targetRect.height) + 50) + 'px';
          wrapper.style.paddingTop = pinContainer.style.height;
          const content = target.cloneNode(true);
          content.className = '';
          content.style.paddingLeft = '30px';
          pinContainer.appendChild(content);
          document.body.appendChild(pinContainer);
        }

      });
      this.appendChild(button);
    }

    disconnectedCallback() {
      document.getElementById('pin-container')?.remove();
    }
  },
});
