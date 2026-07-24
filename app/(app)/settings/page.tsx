'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/ui/RoleBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/lib/auth-context';
import { users, workspace } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Role, User } from '@/types';
import { UserPlus } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUser, switchRole } = useAuth();
  const [tab, setTab] = useState('workspace');

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your workspace, members, and profile." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <WorkspaceTab />
        </TabsContent>
        <TabsContent value="members">
          <MembersTab
            currentUser={user}
            onSwitchRole={switchRole}
          />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab user={user} onUpdate={updateUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkspaceTab() {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(
    'AI-powered customer feedback intelligence platform for product and support teams.'
  );
  const [timezone, setTimezone] = useState('America/New_York');

  const handleSave = () => {
    toast.success('Workspace settings saved');
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Workspace Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ws-name">Workspace Name</Label>
          <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ws-desc">Description</Label>
          <Textarea
            id="ws-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Timezone</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
              <SelectItem value="America/Los_Angeles">America/Los Angeles (PST)</SelectItem>
              <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
              <SelectItem value="Europe/Berlin">Europe/Berlin (CET)</SelectItem>
              <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} className="bg-sky-600 hover:bg-sky-700">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

function MembersTab({
  currentUser,
  onSwitchRole,
}: {
  currentUser: User | null;
  onSwitchRole: (role: Role) => void;
}) {
  const [members, setMembers] = useState<User[]>(users);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('VIEWER');

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email');
      return;
    }
    const newMember: User = {
      id: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' '),
      email: inviteEmail,
      role: inviteRole,
      workspaceId: 'ws_1',
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setInviteRole('VIEWER');
    setInviteOpen(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleChangeRole = (id: string, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    if (id === currentUser?.id) {
      onSwitchRole(role);
    }
    toast.success('Role updated');
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success('Member removed');
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button
            className="bg-sky-600 hover:bg-sky-700"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-sky-100 text-xs font-semibold text-sky-700">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{member.email}</TableCell>
                  <TableCell>
                    {isAdmin && member.id !== currentUser?.id ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleChangeRole(member.id, v as Role)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="ANALYST">ANALYST</SelectItem>
                          <SelectItem value="VIEWER">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <RoleBadge role={member.role} />
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(member.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      {member.id !== currentUser?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-rose-600">
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.name} from the workspace?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemove(member.id)}
                                className="bg-rose-600 hover:bg-rose-700"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!isAdmin && (
        <p className="text-sm text-slate-400">
          Only workspace admins can manage members. You are signed in as{' '}
          <span className="font-medium">{currentUser?.role}</span>.
        </p>
      )}

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin — full access</SelectItem>
                  <SelectItem value="ANALYST">Analyst — manage & analyze feedback</SelectItem>
                  <SelectItem value="VIEWER">Viewer — read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} className="bg-sky-600 hover:bg-sky-700">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileTab({
  user,
  onUpdate,
}: {
  user: User | null;
  onUpdate: (updates: Partial<User>) => void;
}) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    onUpdate({ name, email });
    toast.success('Profile updated');
  };

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setPassword('');
    setConfirmPassword('');
    toast.success('Password updated');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-sky-100 text-lg font-semibold text-sky-700">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              {user && <RoleBadge role={user.role} />}
              <p className="mt-1 text-sm text-slate-500">Member since {new Date(user?.createdAt || '').getFullYear()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-name">Full Name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-email">Email</Label>
            <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile} className="bg-sky-600 hover:bg-sky-700">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="p-password">New Password</Label>
            <Input
              id="p-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-confirm">Confirm Password</Label>
            <Input
              id="p-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handlePasswordChange} variant="outline">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
