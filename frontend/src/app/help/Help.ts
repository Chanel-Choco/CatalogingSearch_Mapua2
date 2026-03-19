// ================= ANGULAR CORE =================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.html',
  styleUrls: ['./help.css']
})
export class HelpComponent {

  activeTab: string = 'manual';

  tabs = [
    {
      id: 'manual',
      label: 'User Manual',
      icon: ''
    },
    {
      id: 'tech-manual-1',
      label: 'Technical Manual 1',
      icon: ''
    },
    {
      id: 'tech-manual-2',
      label: 'Technical Manual 2',
      icon: ''
    },
    {
      id: 'demo',
      label: 'Demo Video',
      icon: ''
    }
  ];

  setTab(tabId: string): void {
    this.activeTab = tabId;
  }
}