
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Users, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '../ui/image-upload';

interface TeamMember {
  id?: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  order_index: number;
}

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    order_index: 0
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      console.log('Fetching team members...');
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        throw error;
      }

      console.log('Team members fetched:', data);
      setTeamMembers(data || []);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving team member:', formData);
      setSaving(true);
      
      if (!formData.name || !formData.position) {
        toast({
          title: 'Error',
          description: 'Name and position are required.',
          variant: 'destructive'
        });
        return;
      }

      // Prepare the data for insert/update
      const memberData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        bio: formData.bio?.trim() || '',
        image_url: formData.image_url || '',
        order_index: formData.order_index || teamMembers.length
      };

      let result;
      if (editingMember?.id) {
        // Update existing member
        console.log('Updating member with ID:', editingMember.id);
        result = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', editingMember.id)
          .select();
      } else {
        // Insert new member
        console.log('Inserting new member');
        result = await supabase
          .from('team_members')
          .insert([memberData])
          .select();
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      console.log('Save successful:', result.data);
      
      toast({ 
        title: editingMember ? 'Team member updated successfully!' : 'Team member added successfully!' 
      });

      // Reset form and state
      setFormData({ name: '', position: '', bio: '', image_url: '', order_index: 0 });
      setEditingMember(null);
      setIsAdding(false);
      
      // Refresh the list
      await fetchTeamMembers();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save team member.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting team member with ID:', id);
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast({ title: 'Team member deleted successfully!' });
      await fetchTeamMembers();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete team member.',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (member: TeamMember) => {
    console.log('Starting edit for member:', member);
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || '',
      image_url: member.image_url || '',
      order_index: member.order_index
    });
    setIsAdding(true);
  };

  const cancelEdit = () => {
    console.log('Canceling edit/add');
    setEditingMember(null);
    setFormData({ name: '', position: '', bio: '', image_url: '', order_index: 0 });
    setIsAdding(false);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading team members...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-gray-300">Manage your team members for the About Us page</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Team Members List */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({teamMembers.length})
              </div>
              <Button
                onClick={() => setIsAdding(true)}
                size="sm"
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={saving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{member.name}</h3>
                  <p className="text-sm text-gray-300 truncate">{member.position}</p>
                  <Badge variant="outline" className="mt-1">
                    Order: {member.order_index}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(member)}
                    disabled={saving}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id!)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <p className="text-gray-400 text-center py-8">No team members added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter team member name"
                  disabled={saving}
                />
              </div>

              <div>
                <Label className="text-gray-300">Position *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter position/title"
                  disabled={saving}
                />
              </div>

              <div>
                <Label className="text-gray-300">Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter bio/description"
                  rows={3}
                  disabled={saving}
                />
              </div>

              <div>
                <Label className="text-gray-300">Order Index</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Display order"
                  disabled={saving}
                />
              </div>

              <ImageUpload
                label="Team Member Photo"
                currentImage={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
                bucket="team-photos"
                folder="members"
              />

              <Button
                onClick={handleSave}
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                disabled={saving || !formData.name || !formData.position}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
