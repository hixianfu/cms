"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routing";
import { ListingFilterDrawer } from "./ListingFilterDrawer";

export type ListingSidebarItem = {
  href: string;
  label: string;
  active: boolean;
  children?: ListingSidebarItem[];
};

type ListingSidebarProps = {
  locale: Locale;
  label: string;
  allItem: ListingSidebarItem;
  items: ListingSidebarItem[];
};

function SidebarLink({
  locale,
  item,
  idPrefix,
}: {
  locale: Locale;
  item: ListingSidebarItem;
  idPrefix: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Boolean(item.children?.length);
  const childrenId = `${idPrefix}-${encodeURIComponent(item.href)}`;

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={localizedHref(locale, item.href)}
          scroll={false}
          aria-current={item.active ? "page" : undefined}
          className={`flex min-h-11 min-w-0 flex-1 items-center rounded-lg px-3 py-2 text-sm transition ${
            item.active
              ? "bg-brand-teal/10 font-semibold text-brand-blue"
              : "text-brand-muted hover:bg-slate-50 hover:text-brand-blue"
          }`}
        >
          {item.label}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
            aria-expanded={expanded}
            aria-controls={childrenId}
            onClick={() => setExpanded((value) => !value)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-brand-muted transition hover:bg-slate-50 hover:text-brand-blue"
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        ) : null}
      </div>
      {hasChildren ? (
        <ul id={childrenId} hidden={!expanded} className="ml-3 border-l border-brand-border pl-3">
          {item.children!.map((child) => (
            <SidebarLink
              key={`${child.href}-${child.label}`}
              locale={locale}
              item={child}
              idPrefix={idPrefix}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function SidebarNavigation({
  locale,
  label,
  allItem,
  items,
}: ListingSidebarProps) {
  const idPrefix = useId();

  return (
    <nav aria-label={label}>
      <ul className="space-y-1">
        <SidebarLink locale={locale} item={allItem} idPrefix={idPrefix} />
        {items.map((item) => (
          <SidebarLink
            key={`${item.href}-${item.label}`}
            locale={locale}
            item={item}
            idPrefix={idPrefix}
          />
        ))}
      </ul>
    </nav>
  );
}

export function ListingSidebar(props: ListingSidebarProps) {
  return (
    <aside aria-label={props.label}>
      <div
        data-testid="listing-sidebar-desktop"
        className="sticky top-24 hidden lg:block"
      >
        <h2 className="mb-3 px-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-ink">
          {props.label}
        </h2>
        <SidebarNavigation {...props} />
      </div>
      <ListingFilterDrawer locale={props.locale} title={props.label}>
        <SidebarNavigation {...props} />
      </ListingFilterDrawer>
    </aside>
  );
}
