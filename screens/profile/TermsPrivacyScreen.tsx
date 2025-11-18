import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, FileText } from 'lucide-react-native';
import Section from '../../components/Section';
import BulletPoint from '../../components/BulletPoint';

export default function TermsPrivacyScreen() {
  return (
    <ScrollView contentContainerClassName="px-5 pb-8 pt-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6 flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full border border-gray-700 active:bg-gray-800">
          <ArrowLeft color="#E5E7EB" size={20} />
        </Pressable>
        <Text className="text-2xl font-bold text-white">Legal</Text>
      </View>

      {/* Info Cards */}
      <View className="mb-8 gap-3">
        <View className="flex-row items-center rounded-2xl border border-emerald-600/30 bg-emerald-950/20 p-4">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20">
            <FileText color="#10B981" size={20} />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-emerald-400">Terms of Service</Text>
            <Text className="text-sm text-emerald-300/70">Last updated: January 2025</Text>
          </View>
        </View>
      </View>

      {/* Terms of Service */}
      <View className="mb-8">
        <View className="mb-6 h-px bg-gray-700" />
        <Text className="mb-6 text-3xl font-bold text-white">Terms of Service</Text>

        <Section title="1. Acceptance of Terms">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            By accessing and using this application, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to these terms, please do not use
            this service.
          </Text>
        </Section>

        <Section title="2. Use License">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            Permission is granted to temporarily access the materials on this application for
            personal, non-commercial transitory viewing only. This is the grant of a license, not a
            transfer of title, and under this license you may not:
          </Text>
          <BulletPoint>Modify or copy the materials</BulletPoint>
          <BulletPoint>Use the materials for any commercial purpose</BulletPoint>
          <BulletPoint>Attempt to decompile or reverse engineer any software</BulletPoint>
          <BulletPoint>Remove any copyright or proprietary notations</BulletPoint>
          <BulletPoint>Transfer the materials to another person</BulletPoint>
        </Section>

        <Section title="3. User Account">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            You are responsible for maintaining the confidentiality of your account and password.
            You agree to accept responsibility for all activities that occur under your account.
          </Text>
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We reserve the right to refuse service, terminate accounts, or remove content at our
            sole discretion.
          </Text>
        </Section>

        <Section title="4. User Content">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            You retain all rights to any content you submit, post or display on or through the
            service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free
            license to use, copy, reproduce, process, adapt, and publish such content.
          </Text>
        </Section>

        <Section title="5. Prohibited Activities">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            You agree not to engage in any of the following:
          </Text>
          <BulletPoint>Violating laws or regulations</BulletPoint>
          <BulletPoint>Infringing on intellectual property rights</BulletPoint>
          <BulletPoint>Transmitting harmful code or malware</BulletPoint>
          <BulletPoint>Harassing or abusing other users</BulletPoint>
          <BulletPoint>Attempting to gain unauthorized access</BulletPoint>
        </Section>

        <Section title="6. Disclaimer">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            The materials on this application are provided on an 'as is' basis. We make no
            warranties, expressed or implied, and hereby disclaim all other warranties including,
            without limitation, implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement of intellectual property.
          </Text>
        </Section>

        <Section title="7. Limitations">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            In no event shall we or our suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising
            out of the use or inability to use the materials on this application.
          </Text>
        </Section>
      </View>

      {/* Privacy Policy */}
      <View className="mb-8">
        <View className="mb-6 h-px bg-gray-700" />
        <Text className="mb-6 text-3xl font-bold text-white">Privacy Policy</Text>

        <Section title="1. Information We Collect">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We collect information that you provide directly to us, including:
          </Text>
          <BulletPoint>Account information (username, email, password)</BulletPoint>
          <BulletPoint>Profile information (birth date, location)</BulletPoint>
          <BulletPoint>Usage data and preferences</BulletPoint>
          <BulletPoint>Device information and identifiers</BulletPoint>
        </Section>

        <Section title="2. How We Use Your Information">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We use the information we collect to:
          </Text>
          <BulletPoint>Provide, maintain, and improve our services</BulletPoint>
          <BulletPoint>Process your transactions and send related information</BulletPoint>
          <BulletPoint>Send you technical notices and support messages</BulletPoint>
          <BulletPoint>Respond to your comments and questions</BulletPoint>
          <BulletPoint>Protect against fraudulent or illegal activity</BulletPoint>
        </Section>

        <Section title="3. Information Sharing">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We do not sell your personal information. We may share your information only in the
            following circumstances:
          </Text>
          <BulletPoint>With your consent</BulletPoint>
          <BulletPoint>To comply with legal obligations</BulletPoint>
          <BulletPoint>To protect our rights and prevent fraud</BulletPoint>
          <BulletPoint>With service providers who assist our operations</BulletPoint>
        </Section>

        <Section title="4. Data Security">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet is 100% secure.
          </Text>
        </Section>

        <Section title="5. Your Rights">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            You have the right to:
          </Text>
          <BulletPoint>Access and receive a copy of your personal data</BulletPoint>
          <BulletPoint>Correct inaccurate or incomplete data</BulletPoint>
          <BulletPoint>Request deletion of your data</BulletPoint>
          <BulletPoint>Object to or restrict processing of your data</BulletPoint>
          <BulletPoint>Withdraw consent at any time</BulletPoint>
        </Section>

        <Section title="6. Data Retention">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We retain your personal information for as long as necessary to provide our services and
            fulfill the purposes outlined in this policy. When you delete your account, we will
            delete your personal information within 30 days.
          </Text>
        </Section>

        <Section title="7. Children's Privacy">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            Our service is not intended for children under 13 years of age. We do not knowingly
            collect personal information from children under 13. If you are a parent or guardian and
            believe your child has provided us with personal information, please contact us.
          </Text>
        </Section>

        <Section title="8. Changes to This Policy">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            We may update this privacy policy from time to time. We will notify you of any changes
            by posting the new policy on this page and updating the "Last updated" date.
          </Text>
        </Section>

        <Section title="9. Contact Us">
          <Text className="mb-3 text-base leading-relaxed text-gray-300">
            If you have any questions about these Terms or Privacy Policy, please contact us at
            support@kotconnect.be
          </Text>
        </Section>
      </View>

      {/* Footer */}
      <View className="mt-4 rounded-2xl border border-gray-700 bg-gray-800 p-5">
        <Text className="text-center text-sm leading-relaxed text-gray-400">
          By using our service, you acknowledge that you have read and understood these terms and
          agree to be bound by them.
        </Text>
      </View>
    </ScrollView>
  );
}
