
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
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index');

      if (error) throw error;
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
      if (!formData.name || !formData.position) {
        toast({
          title: 'Error',
          description: 'Name and position are required.',
          variant: 'destructive'
        });
        return;
      }

      if (editingMember?.id) {
        const { error } = await supabase
          .from('team_members')
          .update(formData)
          .eq('id', editingMember.id);

        if (error) throw error;
        toast({ title: 'Team member updated successfully!' });
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert({ ...formData, order_index: teamMembers.length });

        if (error) throw error;
        toast({ title: 'Team member added successfully!' });
      }

      setFormData({ name: '', position: '', bio: '', image_url: '', order_index: 0 });
      setEditingMember(null);
      setIsAdding(false);
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to save team member.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Team member deleted successfully!' });
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete team member.',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsAdding(true);
  };

  const cancelEdit = () => {
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
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(member.id!)}
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
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
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
                />
              </div>

              <div>
                <Label className="text-gray-300">Position *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter position/title"
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
              >
                <Save className="h-4 w-4 mr-2" />
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
