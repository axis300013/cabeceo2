import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'catalog';
const SECTIONS_COLLECTION = 'catalog_sections';

export const catalogService = {
  // Get all catalog items
  async getAllItems() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
      );
      const items = [];
      querySnapshot.forEach((docSnapshot) => {
        items.push({ 
          id: docSnapshot.id, 
          ...docSnapshot.data() 
        });
      });
      console.log(`Loaded ${items.length} items from Firestore`);
      return items;
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      throw error;
    }
  },

  // Get all sections
  async getAllSections() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, SECTIONS_COLLECTION), orderBy('order', 'asc'))
      );
      const sections = [];
      querySnapshot.forEach((docSnapshot) => {
        sections.push({ 
          id: docSnapshot.id, 
          ...docSnapshot.data() 
        });
      });
      console.log(`Loaded ${sections.length} sections from Firestore`);
      return sections;
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    }
  },

  // Add section
  async addSection(nameHu, nameEn = '', order = 0) {
    try {
      const docRef = await addDoc(collection(db, SECTIONS_COLLECTION), {
        nameHu,
        nameEn: nameEn || nameHu,
        order,
        createdAt: new Date().toISOString()
      });
      console.log(`Added section: ${nameHu}`);
      return docRef.id;
    } catch (error) {
      console.error('Error adding section:', error);
      throw error;
    }
  },

  // Add single item with extended fields
  async addItem(filename, sold = false, cikkszam = '', description = '', sectionId = '') {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        filename,
        sold,
        cikkszam,
        description,
        sectionId,
        createdAt: new Date().toISOString()
      });
      console.log(`Added item: ${filename}`);
      return docRef.id;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // Bulk add items
  async bulkAddItems(filenames) {
    try {
      console.log(`Starting bulk add of ${filenames.length} items...`);
      const promises = filenames.map(filename => 
        this.addItem(filename, false, '', '', '')
      );
      await Promise.all(promises);
      console.log('Bulk add completed successfully');
    } catch (error) {
      console.error('Error in bulk add:', error);
      throw error;
    }
  },

  // Update item with all fields
  async updateItem(itemId, updates) {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(itemRef, updateData);
      console.log(`Updated item ${itemId}`);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Update sold status (kept for backward compatibility)
  async updateSoldStatus(itemId, sold) {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId);
      await updateDoc(itemRef, { 
        sold,
        updatedAt: new Date().toISOString()
      });
      console.log(`Updated item ${itemId} sold status to ${sold}`);
    } catch (error) {
      console.error('Error updating sold status:', error);
      throw error;
    }
  },

  // Bulk update items with batch
  async bulkUpdateItems(updates) {
    try {
      const batch = writeBatch(db);
      updates.forEach(({ id, data }) => {
        const itemRef = doc(db, COLLECTION_NAME, id);
        batch.update(itemRef, {
          ...data,
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.log(`Bulk updated ${updates.length} items`);
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      const itemRef = doc(db, COLLECTION_NAME, itemId);
      await deleteDoc(itemRef);
      console.log(`Deleted item ${itemId}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};