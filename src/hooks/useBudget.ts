import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../lib/supabase';

export interface Budget {
  id: string;
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

  // Add budget with proper error handling
  const addBudget = async (budgetData: BudgetInput) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Adding budget:', budgetData);

      // Ensure user_id matches authenticated user
      const budgetToInsert = {
        ...budgetData,
        user_id: user.id, // Override with authenticated user ID
      };

      const { data, error } = await supabase
        .from('budgets')
        .insert(budgetToInsert)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Budget added successfully:', data);
      
      // Update local state
      setBudgets(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      console.error('Error adding budget:', err);
      setError(err instanceof Error ? err.message : 'Failed to add budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update budget
  const updateBudget = async (id: string, budgetData: Partial<BudgetInput>) => {
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

  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      console.log('Deleting budget:', id);

      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Budget deleted successfully');
      
      // Update local state
      setBudgets(prev => prev.filter(budget => budget.id !== id));
      
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get current active budget
  const getCurrentBudget = useCallback(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    return budgets.find(budget => 
      budget.start_date <= currentDate && 
      budget.end_date >= currentDate
    );
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