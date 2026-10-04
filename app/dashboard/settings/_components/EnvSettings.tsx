"use client";

import { useState, useEffect } from "react";
import { Database, Save, X, Eye, EyeOff, Key, Wallet, MessageCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import MyButton from "@/components/ui/MyButton";
import {
  useGetAdminEnvSettingsQuery,
  useUpdateAdminEnvSettingsMutation,
} from "@/src/redux/api/admin/adminSettingsApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EnvSettings() {
  const { data: envData, isLoading, refetch } = useGetAdminEnvSettingsQuery({});
  const [updateEnvSettings] = useUpdateAdminEnvSettingsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Stripe state
  const [stripeKey, setStripeKey] = useState("");
  const [stripeSecret, setStripeSecret] = useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");

  // PayPal state
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalClientSecret, setPaypalClientSecret] = useState("");
  const [paypalMode, setPaypalMode] = useState<"sandbox" | "live">("sandbox");
  const [paypalBaseUrl, setPaypalBaseUrl] = useState("");

  // WhatsApp state
  const [whatsappToken, setWhatsappToken] = useState("");
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // Show/hide sensitive fields
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  const [showWhatsappToken, setShowWhatsappToken] = useState(false);

  // Store original values for cancel
  const [originalValues, setOriginalValues] = useState<any>(null);

  // Load data when available
  useEffect(() => {
    if (envData) {
      const data = envData;
      setStripeKey(data.stripe?.key || "");
      setStripeSecret(data.stripe?.secret || "");
      setStripeWebhookSecret(data.stripe?.webhook_secret || "");
      setPaypalClientId(data.paypal?.client_id || "");
      setPaypalClientSecret(data.paypal?.client_secret || "");
      setPaypalMode(data.paypal?.mode === "live" ? "live" : "sandbox");
      setPaypalBaseUrl(data.paypal?.base_url || "https://api-m.sandbox.paypal.com");
      setWhatsappToken(data.whatsapp?.token || "");
      setWhatsappPhoneNumberId(data.whatsapp?.phone_number_id || "");
      setWhatsappUrl(data.whatsapp?.url || "https://graph.facebook.com/v25.0");

      setOriginalValues({
        stripe: { key: data.stripe?.key || "", secret: data.stripe?.secret || "", webhook_secret: data.stripe?.webhook_secret || "" },
        paypal: { client_id: data.paypal?.client_id || "", client_secret: data.paypal?.client_secret || "", mode: data.paypal?.mode === "live" ? "live" : "sandbox", base_url: data.paypal?.base_url || "https://api-m.sandbox.paypal.com" },
        whatsapp: { token: data.whatsapp?.token || "", phone_number_id: data.whatsapp?.phone_number_id || "", url: data.whatsapp?.url || "https://graph.facebook.com/v25.0" }
      });
    }
  }, [envData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalValues) {
      setStripeKey(originalValues.stripe.key);
      setStripeSecret(originalValues.stripe.secret);
      setStripeWebhookSecret(originalValues.stripe.webhook_secret);
      setPaypalClientId(originalValues.paypal.client_id);
      setPaypalClientSecret(originalValues.paypal.client_secret);
      setPaypalMode(originalValues.paypal.mode);
      setPaypalBaseUrl(originalValues.paypal.base_url);
      setWhatsappToken(originalValues.whatsapp.token);
      setWhatsappPhoneNumberId(originalValues.whatsapp.phone_number_id);
      setWhatsappUrl(originalValues.whatsapp.url);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        stripe: {
          key: stripeKey,
          secret: stripeSecret,
          webhook_secret: stripeWebhookSecret,
        },
        paypal: {
          client_id: paypalClientId,
          client_secret: paypalClientSecret,
          mode: paypalMode,
          base_url: paypalBaseUrl,
        },
        whatsapp: {
          token: whatsappToken,
          phone_number_id: whatsappPhoneNumberId,
          url: whatsappUrl,
        },
      };

      await updateEnvSettings(payload).unwrap();
      toast.success("Environment settings updated successfully!");

      // Update original values
      setOriginalValues(payload);
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update environment settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-500">Loading environment settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Environment Credentials
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Stripe, PayPal & WhatsApp API credentials
            </p>
          </div>
        </div>
        {!isEditing ? (
          <MyButton onClick={handleEdit} variant="primary" size="md">
            <Key className="w-4 h-4" />
            <span>Edit Credentials</span>
          </MyButton>
        ) : (
          <div className="flex flex-col-reverse md:flex-row gap-2">
            <MyButton onClick={handleCancel} variant="outline" size="md">
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </MyButton>
            <MyButton onClick={handleSave} isLoading={isSaving} size="md">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </MyButton>
          </div>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Stripe Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="w-6 h-6 rounded-full bg-[#635BFF]/10 flex items-center justify-center">
              <span className="text-xs font-bold text-[#635BFF]">$</span>
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Stripe</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Publishable Key
              </label>
              <input
                type="text"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="pk_test_xxx"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Secret Key
              </label>
              <div className="relative mt-1">
                <input
                  type={showStripeSecret ? "text" : "password"}
                  value={stripeSecret}
                  onChange={(e) => setStripeSecret(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 pr-10 ${
                    isEditing
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      : "bg-gray-100 cursor-not-allowed"
                  } text-gray-900 text-sm`}
                  placeholder="sk_test_xxx"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showStripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Webhook Secret
              </label>
              <input
                type="password"
                value={stripeWebhookSecret}
                onChange={(e) => setStripeWebhookSecret(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="whsec_xxx"
              />
            </div>
          </div>
        </div>

        {/* PayPal Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <Wallet className="w-4 h-4 text-[#0070BA]" />
            <h3 className="font-medium text-gray-900 dark:text-white">PayPal</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Client ID
              </label>
              <input
                type="text"
                value={paypalClientId}
                onChange={(e) => setPaypalClientId(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="client_id"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Secret
              </label>
              <div className="relative mt-1">
                <input
                  type={showPaypalSecret ? "text" : "password"}
                  value={paypalClientSecret}
                  onChange={(e) => setPaypalClientSecret(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 pr-10 ${
                    isEditing
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      : "bg-gray-100 cursor-not-allowed"
                  } text-gray-900 text-sm`}
                  placeholder="secret"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowPaypalSecret(!showPaypalSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPaypalSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mode
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    disabled={!isEditing}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 flex items-center justify-between ${
                      isEditing
                        ? "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                        : "bg-gray-100 cursor-not-allowed"
                    } text-gray-900 text-sm`}
                  >
                    <span>{paypalMode === "sandbox" ? "Sandbox (Test Mode)" : "Live (Production)"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[200px]">
                  <DropdownMenuItem
                    onClick={() => setPaypalMode("sandbox")}
                    className="cursor-pointer"
                  >
                    Sandbox (Test Mode)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPaypalMode("live")}
                    className="cursor-pointer"
                  >
                    Live (Production)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Base URL
              </label>
              <input
                type="text"
                value={paypalBaseUrl}
                onChange={(e) => setPaypalBaseUrl(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="https://api-m.sandbox.paypal.com"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <h3 className="font-medium text-gray-900 dark:text-white">WhatsApp Business</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Access Token
              </label>
              <div className="relative mt-1">
                <input
                  type={showWhatsappToken ? "text" : "password"}
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 pr-10 ${
                    isEditing
                      ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      : "bg-gray-100 cursor-not-allowed"
                  } text-gray-900 text-sm`}
                  placeholder="token_here"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowWhatsappToken(!showWhatsappToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showWhatsappToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number ID
              </label>
              <input
                type="text"
                value={whatsappPhoneNumberId}
                onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="1112996207"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Graph API URL
              </label>
              <input
                type="text"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                readOnly={!isEditing}
                className={`w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 ${
                  isEditing
                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    : "bg-gray-100 cursor-not-allowed"
                } text-gray-900 text-sm`}
                placeholder="https://graph.facebook.com/v25.0"
              />
            </div>
          </div>
        </div>

        {/* Info Note */}
        {isEditing && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ⚠️ These credentials are sensitive. Changing them may affect payment processing and WhatsApp integration. 
              Please double-check before saving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}