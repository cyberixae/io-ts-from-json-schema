import { JSONSchema7 } from 'json-schema';
import * as gen from 'io-ts-codegen';

import { DefInput } from '../types/def';

type Template = string
type Variable = string

type Field = string
type Constant = string

type LDO = {
  rel: 'self';

  href: Template,
  hrefSchema: Record<Variable, JSONSchema7>

  headerSchema: Record<Field, JSONSchema7>,
  submissionSchema: JSONSchema7,

  targetHints: Record<Field, Array<Constant>>,
  targetSchema: JSONSchema7
}

type Hyper = {
  links: Array<LDO>
}

export function toHrefTemplate(g: any): (link: LDO) => DefInput {
  return (link) => {

    const hrefTemplateExport = g.defaultExport.concat('_HrefTemplate')
    const schema: JSONSchema7 = {
      "type": "string",
      "const": link.href,
      "default": link.href,
    }

    const title = 'Href Template'
    const description = 'Href body format as described by hyper schema href.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          hrefTemplateExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            hrefTemplateExport,
          ),
          true,
        ),
      }
  }
}

export function toHrefVariables(g: any): (link: LDO) => DefInput {
  return (link) => {

    const hrefVariablesExport = g.defaultExport.concat('_HrefVariables')
    const schema: JSONSchema7 = link.hrefSchema

    const title = 'Href Variables'
    const description = 'Href body format as described by hyper schema hrefSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          hrefVariablesExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            hrefVariablesExport,
          ),
          true,
        ),
      }
  }
}

export function toRequestBody(g: any): (link: LDO) => DefInput {
  return (link) => {

    const requestBodyExport = g.defaultExport.concat('_RequestBody')
    const schema: JSONSchema7 = link.submissionSchema

    const title = 'Request Body'
    const description = 'Request body format as described by hyper schema submissionSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          requestBodyExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            requestBodyExport,
          ),
          true,
        ),
      }
  }
}

export function toRequestHeaders(g: any): (link: LDO) => DefInput {
  return (link) => {

    const requestHeadersExport = g.defaultExport.concat('_RequestHeaders')
    const schema: JSONSchema7 = {
      type: 'object',
      properties: link.headerSchema,
      required: Object.keys(link.headerSchema),
      additionalProperties: true,
    }

    const title = 'Request Headers'
    const description = 'Request headers format as described by hyper schema headerSchema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          requestHeadersExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            requestHeadersExport,
          ),
          true,
        ),
      }
  }
}

export function toResponseBody(g: any): (link: LDO) => DefInput {
  return (link) => {

    const responseBodyExport = g.defaultExport.concat('_ResponseBody')
    const schema: JSONSchema7 = link.targetSchema

    const title = 'Response Body'
    const description = 'Response body format as described by hyper schema targetschema.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          responseBodyExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            responseBodyExport,
          ),
          true,
        ),
      }
  }
}

export function toResponseHeaders(g: any): (link: LDO) => DefInput {
  return (link) => {

    const responseHeadersExport = g.defaultExport.concat('_ResponseHeaders')
    const schema: JSONSchema7 = {
      type: 'object',
      properties: Object.fromEntries(Object.entries(link.targetHints).map(([k,v]) => [k, { enum: v}])),
      required: Object.keys(link.targetHints),
      additionalProperties: true,
    }

    const title = 'Response Headers'
    const description = 'Response headers format as described by hyper schema targetHints.';
    const examples = g.extractExamples(schema);
    const defaultValue = g.extractDefaultValue(schema);

    return {
        meta: {
          title,
          description,
          examples,
          defaultValue,
        },
        dec: gen.typeDeclaration(
          responseHeadersExport,
          gen.brandCombinator(
            g.fromSchema(schema),
            (jx) => g.generateChecks(jx, schema),
            responseHeadersExport,
          ),
          true,
        ),
      }
  }
}

export function fromSelfLink(g: any): (link: LDO) => Array<DefInput> {
  g.imps.add("import * as t from 'io-ts';");

  return (link) => [
    toHrefTemplate(g)(link),
    toHrefVariables(g)(link),
    toRequestHeaders(g)(link),
    toRequestBody(g)(link),
    toResponseHeaders(g)(link),
    toResponseBody(g)(link),
  ]
}

export function fromHyper(g: any): (root: JSONSchema7) => Array<DefInput> {

  return (root) => {

  const hyper: Hyper = root as Hyper;
  const links: Array<LDO> = hyper.links ?? [];
  const selfs: Array<LDO> = links.filter(({rel}) => rel === 'self');
  if (selfs.length > 1) {
    g.warning('found several links where rel="self"')
    return [];
  }
  if (selfs.length !== links.length) {
    g.warning('only hyper schema links with rel="self" are supported at the moment')
  }
  const [first] = selfs;
  if (typeof first === 'undefined') {
    return []
  }
  
  return fromSelfLink(g)(first);
  }
}
