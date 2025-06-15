import { createClient } from '@supabase/supabase-js'

// Test utility for direct Supabase interactions
export class SupabaseTestUtils {
  private supabase

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jotypqdbeoibpzjjiytg.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                               process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdHlwcWRiZW9pYnB6amppeXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTc3MzAsImV4cCI6MjA2MTg3MzczMH0.Pt8pWGgFekGa_JQl7J6q8iipwU5UO4A1T5K13uCOogs'
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration for tests')
    }
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey)
  }

  async createTestUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`)
    }
    
    return data.user
  }

  async deleteTestUser(email: string) {
    try {
      // First, get the user by email
      const { data: users, error: listError } = await this.supabase.auth.admin.listUsers()
      
      if (listError) {
        console.error('Error listing users:', listError)
        return
      }

      const user = users.users.find(u => u.email === email)
      
      if (user) {
        const { error: deleteError } = await this.supabase.auth.admin.deleteUser(user.id)
        
        if (deleteError) {
          console.error('Error deleting user:', deleteError)
        } else {
          console.log(`Successfully deleted test user: ${email}`)
        }
      } else {
        console.log(`Test user not found: ${email}`)
      }
    } catch (error) {
      console.error('Error in deleteTestUser:', error)
    }
  }

  async verifyUserExists(email: string): Promise<boolean> {
    try {
      const { data: users, error } = await this.supabase.auth.admin.listUsers()
      
      if (error) {
        console.error('Error verifying user:', error)
        return false
      }

      return users.users.some(u => u.email === email)
    } catch (error) {
      console.error('Error in verifyUserExists:', error)
      return false
    }
  }

  async signInUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      throw new Error(`Failed to sign in test user: ${error.message}`)
    }
    
    return data.user
  }

  async signOutUser() {
    const { error } = await this.supabase.auth.signOut()
    
    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`)
    }
  }
}

export function generateTestUserData() {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  
  return {
    email: `test-user-${timestamp}-${randomId}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  }
}