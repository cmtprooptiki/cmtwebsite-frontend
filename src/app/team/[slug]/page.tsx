import { notFound } from "next/navigation";
import qs from "qs";
import { StrapiImage } from "@/components/StrapiImage";
import {SocialIcon} from 'react-social-icons'
 
const STRAPI_API_URL = process.env.STRAPI_API_URL || "http://localhost:1337/api";
 
async function fetchTeamMember(slug: string) {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        ProfileImage: { fields: ["url", "alternativeText"] },
        CoverImage: { fields: ["url", "alternativeText"] },
      },
    },
    { encodeValuesOnly: true }
  );
 
  const res = await fetch(`${STRAPI_API_URL}/team-members?${query}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return data?.data?.[0];
}
 
export default async function MemberPage({ params }: { params: { slug: string } }) {
  const member = await fetchTeamMember(params.slug);
  if (!member) return notFound();
 
  const firstName = member.FullName.split(" ")[0];
 
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header Section */}
      <div className="relative bg-[#37393c] text-white px-6 py-16 overflow-hidden">
        {/* Wave Background SVG */}
        <svg
          className="absolute bottom-0 left-0  w-full h-40 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2196f3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2196f3" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,288L60,266.7C120,245,240,203,360,192C480,181,600,203,720,200.3C840,190,960,224,1080,208C1200,192,1320,160,1380,144L1440,128V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
          />
        </svg>
 
        {/* Header Content */}
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          {/* Profile Image */}
          {member.CoverImage?.url && (
            <div className="w-[300px] h-[400px] overflow-hidden">
              <StrapiImage
                src={member.CoverImage.url}
                alt={member.CoverImage.alternativeText || member.FullName}
                width={300}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          )}
 
          {/* Name and Job Title */}
          <div className="flex-1 pt-4 sm:pt-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2196f3]">{member.FullName}</h1>
            <p className="text-lg italic mt-2 text-gray-200">{member.JobTitle}</p>
          </div>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* About Section Header with CTA + Socials */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
          {/* About Heading */}
          <h2 className="text-2xl italic text-[#2196f3] font-semibold">
            About {firstName}
          </h2>
 
          {/* CTA + Socials */}
          <div className="flex flex-col items-start sm:items-end gap-3">
            <a
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-5 py-2 rounded-md font-medium hover:from-blue-600 hover:to-blue-400 transition text-sm"
            >
              Get in Touch →
            </a>
 
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">Social:</span>
 
              {member.LinkedInUrl && (
                <SocialIcon style={{ height: 35, width: 35 }} network = "linkedin" url = {member.LinkedInUrl}/>
              )}                                        
            </div>
          </div>
        </div>
 
        {/* Expertise */}
        {/* {member.Expertise && member.Expertise.length > 0 && (
          <div className="mb-6 space-x-8 text-blue-700 underline text-sm font-medium">
            {member.Expertise.map((tag: string, i: number) => (
              <a key={i} href={`/expertise/${tag.toLowerCase()}`}>{tag}</a>
            ))}
          </div>
        )} */}
 
        {/* Bio */}
        {member.Bio && (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-10">
            {member.Bio}
          </p>
        )}
      </div>
    </div>
  );
}