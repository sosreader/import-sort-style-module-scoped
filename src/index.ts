import { IStyleAPI, IStyleItem } from 'import-sort-style';

interface IImport {
  start: number;
  end: number;
  importStart?: number;
  importEnd?: number;
  type: ImportType;
  moduleName: string;
  defaultMember?: string;
  namespaceMember?: string;
  namedMembers: NamedMember[];
}

declare type ImportType = 'import' | 'require' | 'import-equals' | 'import-type';
declare type NamedMember = {
  name: string;
  alias: string;
};

export default function (styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    unicode,
  } = styleApi;

  function isScopedModule(imported: IImport) {
    return imported.moduleName[0] === '@';
  }

  function isHook(imported: IImport) {
    return imported.moduleName.startsWith("@hook")
  }

  function isComponent(imported: IImport) {
    return imported.moduleName.startsWith("@components")
  }

  function isContext(imported: IImport) {
    return imported.moduleName.startsWith("@contexts")
  }

  function isUtils(imported: IImport) {
    return imported.moduleName.startsWith("@utils")
  }

  function isConfig(imported) {
    return imported.moduleName.startsWith("@config");
  }

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },
    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },
    // import … from "fs";
    {
        match: isNodeModule,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import … from "foo";
    {
        match: and(isAbsoluteModule, not(isScopedModule)),
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import … from "@hook";
    {
        match: isHook,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "@components";
    {
        match: isComponent,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "@contexts";
    {
        match: isContext,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "@utils";
    {
        match: isUtils,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "@config";
    {
        match: isConfig,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },
    
    // import … from "@foo";
    {
        match: isScopedModule,
        sort: moduleName(unicode),
        sortNamedMembers: alias(unicode),
    },
    { separator: true },
    // import … from "./foo";
    // import … from "../foo";
    {
        match: isRelativeModule,
        sort: [dotSegmentCount, moduleName(unicode)],
        sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}
