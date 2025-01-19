import { supabase } from './supabase';
import type { User } from '../types';

export async function signUp(email: string, password: string, name: string, role: 'student' | 'parent') {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // Create user profile in users table
  const { error: profileError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user?.id,
        email,
        name,
        role,
      },
    ]);

  if (profileError) throw profileError;

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Fetch user profile with role
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*, parent_student_relationships!parent_id(*)')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  return profile as User;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) return null;

  // Fetch user profile with relationships
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select(`
      *,
      parent_student_relationships!parent_id(
        student:users!student_id(
          id,
          name,
          email
        )
      )
    `)
    .eq('id', session.user.id)
    .single();

  if (profileError) return null;

  return profile as User;
}

// Admin functions
export async function adminCreateUser(email: string, password: string, name: string, role: 'student' | 'parent' | 'admin') {
  const { data, error } = await supabase.rpc('admin_create_user', {
    email,
    password,
    name,
    role
  });

  if (error) throw error;
  return data;
}

export async function adminLinkParentStudent(parentId: string, studentId: string, isPrimary = false) {
  const { data, error } = await supabase.rpc('admin_link_parent_student', {
    parent_id: parentId,
    student_id: studentId,
    is_primary: isPrimary
  });

  if (error) throw error;
  return data;
}

export async function adminGetAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as User[];
}