import React, { useState, useMemo } from "react";
import GWLayout from "@/components/generational-wealth/GWLayout";
import ContactCard from "@/components/generational-wealth/ContactCard";
import contactsData from "@/data/gw-contacts.json";

interface Contact {
  id: string;
  name: string;
  agency?: string;
  category: string;
  phone?: string;
  address?: string;
  website?: string;
  description: string;
}

const contacts: Contact[] = (contactsData as { contacts: Contact[] }).contacts;

const TABS = [
  { key: "all", label: "All" },
  { key: "government", label: "Government" },
  { key: "foresters", label: "Foresters" },
  { key: "lenders", label: "Lenders" },
  { key: "legal", label: "Legal" },
  { key: "tools", label: "Tools" },
];

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = contacts;
    if (activeTab !== "all") {
      list = list.filter((c) => c.category === activeTab);
    }
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.agency ?? "").toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  return (
    <GWLayout title="Contacts & Resources" lastVerified="April 2026" printable={true}>
      <h1>Contacts &amp; Resources</h1>
      <p className="gw-lead">
        Every phone number, website, and person you might need on this journey.
        Tap any phone number to call directly from your phone.
      </p>

      <div className="gw-contacts__search-wrap">
        <input
          type="search"
          className="gw-contacts__search"
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search contacts"
        />
      </div>

      <div className="gw-contacts__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`gw-contacts__tab${activeTab === tab.key ? " gw-contacts__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="gw-contacts__empty">No contacts match your search.</p>
      ) : (
        <div className="gw-contacts__grid">
          {filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              name={contact.name}
              agency={contact.agency}
              phone={contact.phone}
              address={contact.address}
              website={contact.website}
              description={contact.description}
              category={contact.category}
            />
          ))}
        </div>
      )}
    </GWLayout>
  );
}
