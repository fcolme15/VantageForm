const { supabase } = require('../config/database');

class DatabaseService {
  constructor() {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.');
    }
  }

  _checkConnection() {
    if (!supabase) {
      throw new Error('Database connection not available. Check your environment variables.');
    }
  }

  // Example: Create a new record
  async createRecord(tableName, data) {
    this._checkConnection();
    
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Update a record
  async updateRecord(tableName, id, updates) {
    this._checkConnection();
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error updating record in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Delete a record
  async deleteRecord(tableName, id) {
    this._checkConnection();
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting record from ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Search records
  async searchRecords(tableName, searchColumn, searchTerm) {
    this._checkConnection();
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .ilike(searchColumn, `%${searchTerm}%`);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error(`Error searching records in ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  async getSportsName() {
    this._checkConnection();

    try {
      const { data, error } = await supabase
        .from('sports')
        .select('name');

      if (error) throw error;
      return { success: true, data };
    }
    catch(error) {
      console.error('Error getting sports name:', error);
      return { success: false, error: error.message };
    }
  }

}

module.exports = new DatabaseService();