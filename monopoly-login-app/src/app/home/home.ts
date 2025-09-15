import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Database, ref, push, set, get, child, update, onValue } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Player {
  money: number;
  name: string;
}

interface Box {
  name: string;
  ownerId: string;
  players: { [userId: string]: Player };
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  boxName: string = '';
  joinBoxId: string = '';
  currentUserId: string | null = null;
  currentBoxId: string | null = null;
  currentBox: Box | null = null;
  selectedRecipientId: string | null = null; // For money transfer
  transferAmount: number = 0; // For money transfer
  private authSubscription: Subscription | null = null;
  private boxSubscription: Subscription | null = null;

  constructor(private auth: Auth, private db: Database, private router: Router) { }

  ngOnInit(): void {
    this.authSubscription = authState(this.auth).subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        console.log('Current User ID:', this.currentUserId);
        // Check if user is already in a box
        this.checkUserBoxMembership();
      } else {
        this.currentUserId = null;
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.boxSubscription?.unsubscribe();
  }

  async checkUserBoxMembership() {
    if (!this.currentUserId) return;

    const boxesRef = ref(this.db, 'boxes');
    const snapshot = await get(boxesRef);

    if (snapshot.exists()) {
      const boxes: { [key: string]: Box } = snapshot.val();
      for (const boxId in boxes) {
        if (boxes[boxId].players && boxes[boxId].players[this.currentUserId]) {
          this.currentBoxId = boxId;
          this.subscribeToBoxChanges(boxId);
          console.log('User is already in box:', boxId);
          return;
        }
      }
    }
  }

  async createBox() {
    if (!this.currentUserId || !this.boxName) {
      alert('Please enter a box name and ensure you are logged in.');
      return;
    }

    try {
      const newBoxRef = push(ref(this.db, 'boxes'));
      const newBoxId = newBoxRef.key;

      if (newBoxId) {
        const initialBox: Box = {
          name: this.boxName,
          ownerId: this.currentUserId,
          players: {
            [this.currentUserId]: { money: 1500, name: `Player ${this.currentUserId.substring(0, 4)}` } // Initial money and name
          }
        };
        await set(newBoxRef, initialBox);
        this.currentBoxId = newBoxId;
        this.subscribeToBoxChanges(newBoxId);
        this.boxName = ''; // Clear input
        console.log('Box created with ID:', newBoxId);
      }
    } catch (error: any) {
      console.error('Error creating box:', error.message);
      alert('Error creating box: ' + error.message);
    }
  }

  async joinBox() {
    if (!this.currentUserId || !this.joinBoxId) {
      alert('Please enter a box ID and ensure you are logged in.');
      return;
    }

    try {
      const boxRef = ref(this.db, `boxes/${this.joinBoxId}`);
      const snapshot = await get(boxRef);

      if (snapshot.exists()) {
        const box: Box = snapshot.val();
        if (box.players && box.players[this.currentUserId]) {
          alert('You are already in this box.');
          this.currentBoxId = this.joinBoxId;
          this.subscribeToBoxChanges(this.joinBoxId);
          return;
        }

        const updates: any = {};
        updates[`boxes/${this.joinBoxId}/players/${this.currentUserId}`] = { money: 1500, name: `Player ${this.currentUserId.substring(0, 4)}` };
        await update(ref(this.db), updates);
        this.currentBoxId = this.joinBoxId;
        this.subscribeToBoxChanges(this.joinBoxId);
        this.joinBoxId = ''; // Clear input
        console.log('Joined box:', this.joinBoxId);
      } else {
        alert('Box not found.');
      }
    } catch (error: any) {
      console.error('Error joining box:', error.message);
      alert('Error joining box: ' + error.message);
    }
  }

  subscribeToBoxChanges(boxId: string) {
    this.boxSubscription?.unsubscribe(); // Unsubscribe from previous box if any
    const boxRef = ref(this.db, `boxes/${boxId}`);
    this.boxSubscription = onValue(boxRef, (snapshot) => {
      this.currentBox = snapshot.val();
      console.log('Current Box State:', this.currentBox);
    });
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error logging out:', error.message);
      alert('Error logging out: ' + error.message);
    }
  }

  // Money transfer functionality will be added here in the next phase
  async transferMoney(recipientId: string, amount: number) {
    if (!this.currentUserId || !this.currentBoxId || !this.currentBox) {
      alert('You must be in a box to transfer money.');
      return;
    }

    const senderPlayer = this.currentBox.players[this.currentUserId];
    const recipientPlayer = this.currentBox.players[recipientId];

    if (!senderPlayer || !recipientPlayer) {
      alert('Sender or recipient not found in the current box.');
      return;
    }

    if (senderPlayer.money < amount) {
      alert('Insufficient funds.');
      return;
    }

    if (amount <= 0) {
      alert('Transfer amount must be positive.');
      return;
    }

    const updates: any = {};
    updates[`boxes/${this.currentBoxId}/players/${this.currentUserId}/money`] = senderPlayer.money - amount;
    updates[`boxes/${this.currentBoxId}/players/${recipientId}/money`] = recipientPlayer.money + amount;

    try {
      await update(ref(this.db), updates);
      console.log(`Transferred ${amount} from ${senderPlayer.name} to ${recipientPlayer.name}`);
    } catch (error: any) {
      console.error('Error transferring money:', error.message);
      alert('Error transferring money: ' + error.message);
    }
  }
}
