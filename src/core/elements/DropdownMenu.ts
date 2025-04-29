import { CustomElement } from '../CustomElement';

interface DropdownMenuProps {
    items: { label: string; onClick: () => void }[];
}

export class DropdownMenu extends CustomElement<DropdownMenuProps> {
    static element = 'dropdown-menu';

    constructor(props: DropdownMenuProps = { items: [] }) {
        super(props);

        // Add event listener to toggle dropdown visibility
        this.addEventListener('click', () => {
            const dropdown = this.querySelector('.dropdown-content');
            dropdown?.classList.toggle('show');
        });
    }

    template(): string {
        return `
           <style>
        .dropdown-button {
            padding: 8px 16px;
            cursor: pointer;
            text-align: center; /* Corrected property */
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .dropdown-button:hover {
            background-color: #f0f0f0;
        }
        </style>
        <div class="dropdown">
            <div class="select">
                ${this.props.items
                .map(
                    (item, index) => `
                            <option class="dropdown-button" data-index="${index}">
                                ${item.label}
                            </option>
                        `
                )
                .join('')}
            </div>
        </div>
    `;
    }

    connectedCallback() {
        super.connectedCallback();

        // Attach event listeners to dropdown buttons
        const buttons = this.querySelectorAll('.dropdown-button');
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const menuItem = this.props.items[index];
                if (menuItem && menuItem.onClick) {
                    menuItem.onClick();
                }
            });
        });

        console.log('Event listeners attached to dropdown buttons.');
    }

}
