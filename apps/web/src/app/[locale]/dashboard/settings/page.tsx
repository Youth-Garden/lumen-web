import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Icons name="settings" className="w-8 h-8 text-primary" />
          Settings
        </h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex gap-2">
            <Icons name="user" className="w-4 h-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2">
            <Icons name="shield" className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Icons name="bell" className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Lumen User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" defaultValue="I am learning English with Lumen!" />
              </div>
              <Button>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your email, password, and security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="user@lumen.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button variant="destructive">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              Notification settings are currently managed system-wide.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
