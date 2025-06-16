
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { User, Package, MapPin, CreditCard, Settings, LogOut } from 'lucide-react';

const AccountDashboard = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your account dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Button className="w-full">Sign In</Button>
              <p className="text-center text-sm text-gray-600">
                Don't have an account? <span className="text-blue-600 cursor-pointer">Sign up</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 125.99,
      items: ['R-410A Refrigerant (25 lb)']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: 89.99,
      items: ['R-134A Refrigerant (30 lb)']
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 299.99,
      items: ['R-22 Refrigerant (30 lb)', 'Shipping Insurance']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Information
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Settings className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input value={user.name} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input value={user.email} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input value={user.company || ''} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">EPA License</label>
                  <Input value={user.epaLicense || ''} disabled={!isEditing} />
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Account Type:</span>
                  <Badge variant="secondary">Business</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>EPA Verified:</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Member Since:</span>
                  <span>January 2024</span>
                </div>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track your recent orders and download invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">Order {order.id}</div>
                        <div className="text-sm text-gray-500">Placed on {order.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.total}</div>
                        <Badge
                          variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                          className={order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {order.items.join(', ')}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Track Order</Button>
                      {order.status === 'Delivered' && (
                        <Button variant="outline" size="sm">Download Invoice</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
              <CardDescription>Manage your shipping and billing addresses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{address.name}</div>
                        <div className="text-sm text-gray-600">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </div>
                        {address.isDefault && (
                          <Badge variant="secondary" className="mt-2">Default</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  + Add New Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your payment methods and billing preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  <div className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-gray-500">Expires 12/26</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">+ Add Payment Method</Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing Address</h3>
                  <div className="text-sm text-gray-600">
                    Same as default shipping address
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountDashboard;
