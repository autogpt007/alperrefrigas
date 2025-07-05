
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { User, Package, FileText, Settings, Bell, CreditCard } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const MyAccount = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'HVAC Solutions Inc.',
    licenseNumber: 'EPA-608-123456'
  });

  const orders = [
    {
      id: 'ORD-20241201-001',
      date: '2024-12-01',
      status: 'Delivered',
      total: 2850.00,
      items: ['R-410A (25 lbs)', 'R-134a (30 lbs)']
    },
    {
      id: 'ORD-20241115-002',
      date: '2024-11-15',
      status: 'Processing',
      total: 1250.00,
      items: ['R-404A (25 lbs)']
    }
  ];

  const quotes = [
    {
      id: 'RFQ-20241205-001',
      date: '2024-12-05',
      status: 'Pending Review',
      items: ['2 Pallets R-410A', '1 Container R-134a']
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title="My Account - Alper Refrigerants"
        description="Manage your account, view orders, track shipments, and update your profile information."
        canonicalUrl="/account"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-gray-600">
            Manage your account settings, view orders, and track your refrigerant purchases.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <Input
                    value={userInfo.company}
                    onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">EPA License Number</label>
                  <Input
                    value={userInfo.licenseNumber}
                    onChange={(e) => setUserInfo({...userInfo, licenseNumber: e.target.value})}
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and track your refrigerant orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                          <p className="text-lg font-semibold mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Items: {order.items.join(', ')}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {order.status !== 'Delivered' && (
                          <Button variant="outline" size="sm">Track Order</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Quote Requests</CardTitle>
                <CardDescription>
                  Manage your refrigerant quote requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{quote.id}</h3>
                          <p className="text-sm text-gray-600">Requested on {quote.date}</p>
                        </div>
                        <Badge variant="secondary">{quote.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Items: {quote.items.join(', ')}
                      </div>
                      <Button variant="outline" size="sm">View Quote</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-600">No payment methods on file</p>
                    <Button variant="outline" className="mt-2">Add Payment Method</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                  <div className="border rounded-lg p-4">
                    <p className="font-medium">HVAC Solutions Inc.</p>
                    <p className="text-sm text-gray-600">123 Main Street</p>
                    <p className="text-sm text-gray-600">Houston, TX 77001</p>
                    <Button variant="outline" className="mt-2">Edit Address</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-gray-600">Receive notifications about your orders</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Price Alerts</p>
                        <p className="text-sm text-gray-600">Get notified about price changes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security</h3>
                  <div className="space-y-2">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Enable Two-Factor Authentication</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyAccount;
