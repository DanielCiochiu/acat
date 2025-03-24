import { CustomElement } from '../../../core/CustomElement.ts';
import { html } from '../../../helpers/dom.ts';

export class ThemeToggleButton extends CustomElement {
  static element: string = 'theme-toggle-button';
  private isDarkTheme: boolean = false;

  constructor() {
    super();
    this.addEventListener('click', this.toggleTheme.bind(this));

    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.style.setProperty('--body-background', '#222');
      document.documentElement.style.setProperty('--text-color', '#f0f8ff');
    } else {
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.style.setProperty('--body-background', '#fff');
      document.documentElement.style.setProperty('--text-color', '#333');
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  template() {
    return html`
      <div class="theme-toggle">
        <div class="sky">
          <div class="sun-container">
            <div class="sun"></div>
          </div>
          <div class="moon"></div>
          <div class="cute-cloud cute-cloud1">
            <div class="cloud-body"></div>
            <div class="cloud-body"></div>
          </div>
          <div class="cute-cloud cute-cloud2">
            <div class="cloud-body"></div>
            <div class="cloud-body"></div>
          </div>
          <div class="star star1"></div>
          <div class="star star2"></div>
          <div class="star star3"></div>
          <div class="star star4"></div>
          <div class="star star5"></div>
        </div>
      </div>
    `;
  }
}