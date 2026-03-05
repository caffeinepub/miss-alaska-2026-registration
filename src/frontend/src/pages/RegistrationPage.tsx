import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Crown,
  ImageIcon,
  Loader2,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Registration } from "../backend";
import { useSubmitRegistration } from "../hooks/useQueries";

interface FormData {
  // Section 1
  fullName: string;
  dateOfBirth: string;
  age: string;
  address: string;
  contactNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  alakpleConnection: string; // "Mother" | "Father" | "Other"
  hometown: string;
  // Section 2
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hips: string;
  educationLevel: string;
  occupationOrSchool: string;
  hobbiesInterests: string;
  talentSkills: string;
  previousPageantExperience: string;
  // Section 3
  bioPlatformStatement: string;
}

const initialForm: FormData = {
  fullName: "",
  dateOfBirth: "",
  age: "",
  address: "",
  contactNumber: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  alakpleConnection: "",
  hometown: "",
  height: "",
  weight: "",
  bust: "",
  waist: "",
  hips: "",
  educationLevel: "",
  occupationOrSchool: "",
  hobbiesInterests: "",
  talentSkills: "",
  previousPageantExperience: "",
  bioPlatformStatement: "",
};

function FileUploadZone({
  label,
  hint,
  file,
  onFileChange,
  required,
  ocid,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
  required?: boolean;
  ocid: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-rose ml-0.5">*</span>}
      </Label>
      <button
        type="button"
        className="upload-zone rounded-xl p-6 cursor-pointer text-center transition-all w-full"
        onClick={() => inputRef.current?.click()}
        aria-label={`Upload ${label}`}
        data-ocid={ocid}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-accent-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground truncate max-w-full">
              {file.name}
            </p>
            <Badge
              variant="outline"
              className="text-xs border-gold text-gold-dark"
            >
              Ready to upload
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
      </button>
    </div>
  );
}

function SectionHeader({
  number,
  title,
  subtitle,
  colorClass,
}: {
  number: string;
  title: string;
  subtitle: string;
  colorClass: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5 ${colorClass}`}
      >
        {number}
      </div>
      <div>
        <CardTitle className="font-display text-xl text-foreground">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function RegistrationPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [fullBodyFile, setFullBodyFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | "headshot" | "fullBody", string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: submitRegistration, isPending } =
    useSubmitRegistration();

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.age || Number.isNaN(Number(form.age)))
      newErrors.age = "Valid age is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (!form.emergencyContactName.trim())
      newErrors.emergencyContactName = "Emergency contact name is required";
    if (!form.emergencyContactPhone.trim())
      newErrors.emergencyContactPhone = "Emergency contact phone is required";
    if (!form.alakpleConnection)
      newErrors.alakpleConnection = "Please select your connection to Alakple";
    if (form.alakpleConnection === "Other" && !form.hometown.trim())
      newErrors.hometown = "Please enter your hometown";
    if (!form.bioPlatformStatement.trim())
      newErrors.bioPlatformStatement = "Bio/Platform statement is required";
    if (!headshotFile) newErrors.headshot = "Headshot photo is required";
    if (!fullBodyFile) newErrors.fullBody = "Full-body photo is required";

    const wordCount = form.bioPlatformStatement
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (
      form.bioPlatformStatement.trim() &&
      (wordCount < 50 || wordCount > 250)
    ) {
      newErrors.bioPlatformStatement = "Please write between 100–200 words";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields");
      // Scroll to first error
      const el = document.querySelector("[data-error]");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      let headshotBlob: ExternalBlob | undefined;
      let fullBodyBlob: ExternalBlob | undefined;

      if (headshotFile) {
        const bytes = new Uint8Array(await headshotFile.arrayBuffer());
        headshotBlob = ExternalBlob.fromBytes(bytes);
      }
      if (fullBodyFile) {
        const bytes = new Uint8Array(await fullBodyFile.arrayBuffer());
        fullBodyBlob = ExternalBlob.fromBytes(bytes);
      }

      await submitRegistration({
        fullName: form.fullName.trim(),
        dateOfBirth: form.dateOfBirth,
        age: BigInt(Number(form.age)),
        address: form.address.trim(),
        contactNumber: form.contactNumber.trim(),
        emergencyContactName: form.emergencyContactName.trim(),
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        height: Number.parseFloat(form.height) || 0,
        weight: Number.parseFloat(form.weight) || 0,
        bust: Number.parseFloat(form.bust) || 0,
        waist: Number.parseFloat(form.waist) || 0,
        hips: Number.parseFloat(form.hips) || 0,
        educationLevel: form.educationLevel.trim(),
        occupationOrSchool: form.occupationOrSchool.trim(),
        hobbiesInterests: form.hobbiesInterests.trim(),
        talentSkills: form.talentSkills.trim(),
        previousPageantExperience: form.previousPageantExperience.trim(),
        bioPlatformStatement: form.bioPlatformStatement.trim(),
        headshotBlob,
        fullBodyPhotoBlob: fullBodyBlob,
        timestamp: BigInt(0),
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] pageant-bg flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center max-w-md"
          data-ocid="registration.success_state"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            }}
            className="mb-6 inline-block"
          >
            <img
              src="/assets/generated/miss-alaska-crown-transparent.dim_200x200.png"
              alt="Crown"
              className="w-24 h-24 mx-auto object-contain drop-shadow-lg"
            />
          </motion.div>
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Registration Submitted!
          </h2>
          <p className="text-muted-foreground text-lg mb-2">
            Thank you,{" "}
            <strong className="text-foreground">{form.fullName}</strong>!
          </p>
          <p className="text-muted-foreground mb-8">
            Your application for Miss Alaska 2026 (Alakple Beauty Pageant) has
            been received. We'll be in touch soon.
          </p>
          <div className="flex justify-center gap-2 mb-8">
            {["s1", "s2", "s3", "s4", "s5"].map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Star className="w-6 h-6 fill-gold text-gold" />
              </motion.div>
            ))}
          </div>
          <Button
            data-ocid="registration.submit_button"
            onClick={() => {
              setForm(initialForm);
              setHeadshotFile(null);
              setFullBodyFile(null);
              setErrors({});
              setSubmitted(false);
            }}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Submit Another Registration
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pageant-bg">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/miss-alaska-hero-banner.dim_1200x400.jpg"
          alt="Miss Alaska 2026 Banner"
          className="w-full h-48 sm:h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-2"
          >
            <img
              src="/assets/generated/miss-alaska-crown-transparent.dim_200x200.png"
              alt="Crown"
              className="w-12 h-12 object-contain drop-shadow-lg animate-float"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl font-bold text-white drop-shadow-lg"
          >
            Miss Alaska 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-sm sm:text-base mt-2 font-body"
          >
            Alakple Beauty Pageant — Official Registration
          </motion.p>
        </div>
      </div>

      {/* Decorative banner */}
      <div className="gold-gradient py-2.5 text-center">
        <p className="text-sm font-semibold text-amber-900 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Applications Open for 2026 Season — Submit Your Registration Below
          <Sparkles className="w-4 h-4" />
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-3xl mx-auto px-4 py-10 space-y-8"
      >
        {/* Section 1: Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="section-card-1 shadow-pageant">
            <CardHeader>
              <SectionHeader
                number="1"
                title="Personal Information"
                subtitle="Basic details about you"
                colorClass="section-number-1"
              />
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="font-semibold">
                  Full Name <span className="text-rose">*</span>
                </Label>
                <Input
                  id="fullName"
                  data-ocid="registration.fullName.input"
                  placeholder="Enter your full legal name"
                  value={form.fullName}
                  onChange={update("fullName")}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    data-error
                    className="text-xs text-destructive"
                    data-ocid="registration.fullName.error_state"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* DOB + Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="font-semibold">
                    Date of Birth <span className="text-rose">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    data-ocid="registration.dateOfBirth.input"
                    value={form.dateOfBirth}
                    onChange={update("dateOfBirth")}
                    className={errors.dateOfBirth ? "border-destructive" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p
                      data-error
                      className="text-xs text-destructive"
                      data-ocid="registration.dateOfBirth.error_state"
                    >
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="font-semibold">
                    Age <span className="text-rose">*</span>
                    <span className="text-muted-foreground font-normal text-xs ml-1">
                      (must be 18+)
                    </span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="35"
                    data-ocid="registration.age.input"
                    placeholder="e.g. 22"
                    value={form.age}
                    onChange={update("age")}
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p
                      data-error
                      className="text-xs text-destructive"
                      data-ocid="registration.age.error_state"
                    >
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="font-semibold">
                  Address <span className="text-rose">*</span>
                </Label>
                <Input
                  id="address"
                  data-ocid="registration.address.input"
                  placeholder="Street, City, State, ZIP (e.g. 123 Main St, Anchorage, AK 99501)"
                  value={form.address}
                  onChange={update("address")}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p
                    data-error
                    className="text-xs text-destructive"
                    data-ocid="registration.address.error_state"
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5">
                <Label htmlFor="contactNumber" className="font-semibold">
                  Contact Number <span className="text-rose">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  data-ocid="registration.contactNumber.input"
                  placeholder="(907) 555-0100"
                  value={form.contactNumber}
                  onChange={update("contactNumber")}
                  className={errors.contactNumber ? "border-destructive" : ""}
                />
                {errors.contactNumber && (
                  <p
                    data-error
                    className="text-xs text-destructive"
                    data-ocid="registration.contactNumber.error_state"
                  >
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Emergency Contact
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="emergencyContactName"
                      className="font-semibold"
                    >
                      Name <span className="text-rose">*</span>
                    </Label>
                    <Input
                      id="emergencyContactName"
                      data-ocid="registration.emergencyContactName.input"
                      placeholder="Full name"
                      value={form.emergencyContactName}
                      onChange={update("emergencyContactName")}
                      className={
                        errors.emergencyContactName ? "border-destructive" : ""
                      }
                    />
                    {errors.emergencyContactName && (
                      <p
                        data-error
                        className="text-xs text-destructive"
                        data-ocid="registration.emergencyContactName.error_state"
                      >
                        {errors.emergencyContactName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="emergencyContactPhone"
                      className="font-semibold"
                    >
                      Phone <span className="text-rose">*</span>
                    </Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      data-ocid="registration.emergencyContactPhone.input"
                      placeholder="(907) 555-0101"
                      value={form.emergencyContactPhone}
                      onChange={update("emergencyContactPhone")}
                      className={
                        errors.emergencyContactPhone ? "border-destructive" : ""
                      }
                    />
                    {errors.emergencyContactPhone && (
                      <p
                        data-error
                        className="text-xs text-destructive"
                        data-ocid="registration.emergencyContactPhone.error_state"
                      >
                        {errors.emergencyContactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Are you from Alakple? */}
              <div className="space-y-2">
                <Label className="font-semibold">
                  Are you from Alakple? <span className="text-rose">*</span>
                </Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {["Mother", "Father", "Other"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2.5 transition-all select-none ${
                        form.alakpleConnection === option
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="alakpleConnection"
                        value={option}
                        checked={form.alakpleConnection === option}
                        onChange={() => {
                          setForm((prev) => ({
                            ...prev,
                            alakpleConnection: option,
                            hometown: option !== "Other" ? "" : prev.hometown,
                          }));
                          if (errors.alakpleConnection) {
                            setErrors((prev) => ({
                              ...prev,
                              alakpleConnection: undefined,
                            }));
                          }
                        }}
                        data-ocid="registration.alakpleConnection.radio"
                        className="accent-primary"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {errors.alakpleConnection && (
                  <p
                    data-error
                    className="text-xs text-destructive"
                    data-ocid="registration.alakpleConnection.error_state"
                  >
                    {errors.alakpleConnection}
                  </p>
                )}
                {form.alakpleConnection === "Other" && (
                  <div className="space-y-1.5 mt-2">
                    <Label htmlFor="hometown" className="font-semibold">
                      Your Hometown <span className="text-rose">*</span>
                    </Label>
                    <Input
                      id="hometown"
                      data-ocid="registration.hometown.input"
                      placeholder="Enter your hometown"
                      value={form.hometown}
                      onChange={update("hometown")}
                      className={errors.hometown ? "border-destructive" : ""}
                    />
                    {errors.hometown && (
                      <p
                        data-error
                        className="text-xs text-destructive"
                        data-ocid="registration.hometown.error_state"
                      >
                        {errors.hometown}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Physical and Background Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="section-card-2 shadow-pageant">
            <CardHeader>
              <SectionHeader
                number="2"
                title="Physical & Background Details"
                subtitle="Tell us more about yourself"
                colorClass="section-number-2"
              />
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Height & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="font-semibold">
                    Height
                  </Label>
                  <Input
                    id="height"
                    data-ocid="registration.height.input"
                    placeholder="e.g. 5'6&quot; or 168 cm"
                    value={form.height}
                    onChange={update("height")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="font-semibold">
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    data-ocid="registration.weight.input"
                    placeholder="e.g. 130 lbs or 59 kg"
                    value={form.weight}
                    onChange={update("weight")}
                  />
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-2">
                <Label className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  Measurements
                  <Badge
                    variant="outline"
                    className="text-xs font-normal border-muted-foreground/30"
                  >
                    Optional
                  </Badge>
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bust" className="text-sm">
                      Bust
                    </Label>
                    <Input
                      id="bust"
                      data-ocid="registration.bust.input"
                      placeholder='e.g. 34"'
                      value={form.bust}
                      onChange={update("bust")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="waist" className="text-sm">
                      Waist
                    </Label>
                    <Input
                      id="waist"
                      data-ocid="registration.waist.input"
                      placeholder='e.g. 26"'
                      value={form.waist}
                      onChange={update("waist")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hips" className="text-sm">
                      Hips
                    </Label>
                    <Input
                      id="hips"
                      data-ocid="registration.hips.input"
                      placeholder='e.g. 36"'
                      value={form.hips}
                      onChange={update("hips")}
                    />
                  </div>
                </div>
              </div>

              {/* Education & Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="educationLevel" className="font-semibold">
                    Education Level
                  </Label>
                  <Input
                    id="educationLevel"
                    data-ocid="registration.educationLevel.input"
                    placeholder="e.g. High School, College, Bachelor's"
                    value={form.educationLevel}
                    onChange={update("educationLevel")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="occupationOrSchool" className="font-semibold">
                    Occupation / School
                  </Label>
                  <Input
                    id="occupationOrSchool"
                    data-ocid="registration.occupationOrSchool.input"
                    placeholder="Current job or school name"
                    value={form.occupationOrSchool}
                    onChange={update("occupationOrSchool")}
                  />
                </div>
              </div>

              {/* Hobbies */}
              <div className="space-y-1.5">
                <Label htmlFor="hobbiesInterests" className="font-semibold">
                  Hobbies & Interests
                </Label>
                <Textarea
                  id="hobbiesInterests"
                  data-ocid="registration.hobbiesInterests.textarea"
                  placeholder="Describe your hobbies and interests..."
                  rows={3}
                  value={form.hobbiesInterests}
                  onChange={update("hobbiesInterests")}
                  className="resize-none"
                />
              </div>

              {/* Talent/Skills */}
              <div className="space-y-1.5">
                <Label htmlFor="talentSkills" className="font-semibold">
                  Talent / Skills
                </Label>
                <Textarea
                  id="talentSkills"
                  data-ocid="registration.talentSkills.textarea"
                  placeholder="e.g. singing, dancing, playing piano, public speaking..."
                  rows={3}
                  value={form.talentSkills}
                  onChange={update("talentSkills")}
                  className="resize-none"
                />
              </div>

              {/* Previous Pageant Experience */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="previousPageantExperience"
                  className="font-semibold"
                >
                  Previous Pageant Experience
                </Label>
                <Textarea
                  id="previousPageantExperience"
                  data-ocid="registration.previousPageantExperience.textarea"
                  placeholder="List any previous pageant titles, competitions, or write 'None' if first time..."
                  rows={3}
                  value={form.previousPageantExperience}
                  onChange={update("previousPageantExperience")}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: Media and Attachments */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="section-card-3 shadow-pageant">
            <CardHeader>
              <SectionHeader
                number="3"
                title="Media & Attachments"
                subtitle="Upload your photos and write your bio"
                colorClass="section-number-3"
              />
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Photo uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <FileUploadZone
                    label="Headshot Photo"
                    hint="Professional photo required (JPG, PNG)"
                    file={headshotFile}
                    onFileChange={setHeadshotFile}
                    required
                    ocid="registration.headshot.upload_button"
                  />
                  {errors.headshot && (
                    <p
                      data-error
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.headshot.error_state"
                    >
                      {errors.headshot}
                    </p>
                  )}
                </div>
                <div>
                  <FileUploadZone
                    label="Full-Body Photo"
                    hint="Evening wear or swimsuit (JPG, PNG)"
                    file={fullBodyFile}
                    onFileChange={setFullBodyFile}
                    required
                    ocid="registration.fullBody.upload_button"
                  />
                  {errors.fullBody && (
                    <p
                      data-error
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.fullBody.error_state"
                    >
                      {errors.fullBody}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bioPlatformStatement" className="font-semibold">
                  Brief story about yours <span className="text-rose">*</span>
                  <span className="text-muted-foreground font-normal text-xs ml-1">
                    (100–200 words)
                  </span>
                </Label>
                <Textarea
                  id="bioPlatformStatement"
                  data-ocid="registration.bio.textarea"
                  placeholder="Write 100–200 words about why you're entering this pageant, your advocacy, community involvement, or personal mission..."
                  rows={7}
                  value={form.bioPlatformStatement}
                  onChange={update("bioPlatformStatement")}
                  className={`resize-none ${errors.bioPlatformStatement ? "border-destructive" : ""}`}
                />
                <div className="flex justify-between items-center">
                  {errors.bioPlatformStatement ? (
                    <p
                      data-error
                      className="text-xs text-destructive"
                      data-ocid="registration.bio.error_state"
                    >
                      {errors.bioPlatformStatement}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-muted-foreground text-right">
                    {
                      form.bioPlatformStatement
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length
                    }{" "}
                    / 200 words
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4 pb-6"
        >
          <div className="sparkle-divider w-full py-4">
            <span className="relative z-10 bg-background px-4 text-muted-foreground text-sm">
              ✦ Ready to Submit? ✦
            </span>
          </div>
          <Button
            type="submit"
            data-ocid="registration.submit_button"
            disabled={isPending}
            size="lg"
            className="w-full sm:w-auto px-12 py-3 text-base font-semibold shadow-pageant bg-primary hover:bg-primary/90 text-white rounded-full transition-all hover:shadow-gold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Registration…
              </>
            ) : (
              <>
                <Crown className="mr-2 h-5 w-5" />
                Submit My Registration
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you confirm all information is accurate and you meet
            the age requirements.
          </p>
        </motion.div>
      </form>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground space-y-1">
        <p>
          © {new Date().getFullYear()} Miss Alaska 2026 — Alakple Beauty
          Pageant.
        </p>
        <p>
          Built by{" "}
          <span className="font-medium text-foreground">@digitasoja</span> with
          love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
