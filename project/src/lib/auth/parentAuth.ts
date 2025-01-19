import { supabase } from '../supabase';

export async function createChildAccount(
  parentId: string,
  childData: {
    email: string;
    password: string;
    name: string;
  }
) {
  try {
    // Create auth account for child
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: childData.email,
      password: childData.password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: childData.email,
        name: childData.name,
        role: 'student'
      })
      .select()
      .single();

    if (userError) throw userError;

    // Link parent and child accounts
    const { error: linkError } = await supabase
      .from('parent_child_accounts')
      .insert({
        parent_id: parentId,
        child_id: userData.id
      });

    if (linkError) throw linkError;

    return userData;
  } catch (error) {
    console.error('Failed to create child account:', error);
    throw error;
  }
}