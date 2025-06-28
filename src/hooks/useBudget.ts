import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../lib/supabase';

export interface Budget {
  id: number;
  user_id: string;
  amount: number;
  period_type: 'monthly' | 'weekly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export type BudgetInput = Omit<Budget, 'id' | 'created_at' | 'updated_at'>;

export const useBudget = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch budgets with better error handling and logging
  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching budgets for user:', user.id);

      // Get current date for filtering
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', currentDate) // Only get active budgets
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched budgets:', data);
      setBudgets(data || []);
      
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add or update budget with proper error handling
  const addBudget = async (budgetData: BudgetInput, id?: number) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Adding/Updating budget:', { ...budgetData, id });

      // Ensure user_id matches authenticated user
      const budgetToUpsert = {
        ...budgetData,
        user_id: user.id, // Override with authenticated user ID
      };

      let response;

      if (id) {
        // Update existing budget with the provided ID
        const { data, error } = await supabase
          .from('budgets')
          .update(budgetToUpsert)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
        console.log('Budget updated successfully:', response);
      } else {
        // Create new budget
        const { data, error } = await supabase
          .from('budgets')
          .insert(budgetToUpsert)
          .select()
          .single();
        
        if (error) throw error;
        response = data;
        console.log('Budget added successfully:', response);
      }
      
      // Refresh budgets to update local state
      await fetchBudgets();
      
      return response;
    } catch (err) {
      console.error('Error in add/update budget:', err);
      setError(err instanceof Error ? err.message : 'Failed to save budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update budget
  const updateBudget = async (id: number, budgetData: Partial<BudgetInput>) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      console.log('Updating budget:', id, budgetData);

      const { data, error } = await supabase
        .from('budgets')
        .update(budgetData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Budget updated successfully:', data);
      
      // Update local state
      setBudgets(prev => prev.map(budget => 
        budget.id === id ? data : budget
      ));
      
      return data;
    } catch (err) {
      console.error('Error updating budget:', err);
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete budget function - sets amount to 0 instead of deleting
  const deleteBudget = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      console.log('Setting budget amount to 0 for ID:', id);

      // Update the budget to set amount to 0 instead of deleting
      const { data, error } = await supabase
        .from('budgets')
        .update({ 
          amount: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating budget amount:', error);
        throw error;
      }

      console.log('Budget amount set to 0 successfully:', data);
      
      // Update local state with the modified budget
      setBudgets(prev => prev.map(budget => 
        budget.id === id ? { ...budget, amount: 0, updated_at: new Date().toISOString() } : budget
      ));
      
      return data;
      
    } catch (err) {
      console.error('Error in deleteBudget:', err);
      setError(err instanceof Error ? err.message : 'Failed to update budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get current active budget (returns the first budget since we only allow one)
  const getCurrentBudget = useCallback(() => {
    return budgets.length > 0 ? budgets[0] : null;
  }, [budgets]);

  // Calculate budget utilization (requires expenses)
  const getBudgetUtilization = useCallback((budget: Budget, totalExpenses: number) => {
    const utilization = (totalExpenses / budget.amount) * 100;
    const remaining = budget.amount - totalExpenses;
    
    return {
      utilization: Math.min(utilization, 100),
      remaining,
      isOverBudget: totalExpenses > budget.amount,
    };
  }, []);

  // Load budgets on mount
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
    getCurrentBudget,
    getBudgetUtilization,
  };
};