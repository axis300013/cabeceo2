import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

class AuthService {
  constructor() {
    this.user = null;
    this.isLoading = true;
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User signed in:', result.user.email);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Check if user is authorized admin (you can customize this logic)
  isAuthorized(user) {
    if (!user) return false;
    
    // You can add specific email addresses that should have admin access
    const authorizedEmails = [
      // Add your admin email addresses here
      'admin@cabeceo.com',
      'axis3000@gmail.com',
      'binszki.m@gmail.com'
      // You can add more authorized emails
    ];

    // For now, we'll allow any Google-authenticated user
    // You should customize this logic based on your needs
    return user.email && user.emailVerified;
    
    // Uncomment this line if you want to restrict to specific emails:
    // return authorizedEmails.includes(user.email);
  }
}

export default new AuthService();
