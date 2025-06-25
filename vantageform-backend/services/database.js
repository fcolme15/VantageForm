const { supabase } = require('../config/database');

class DatabaseService {
  // Example: Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles') // Replace with your table name
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Example: Create a new record
  async createRecord(tableName, data) {
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

  // Example: Get paginated data
  async getPaginatedData(tableName, page = 1, limit = 10, filters = {}) {
    try {
      let query = supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error(`Error fetching paginated data from ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Example: Search records
  async searchRecords(tableName, searchColumn, searchTerm) {
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
}

module.exports = new DatabaseService();