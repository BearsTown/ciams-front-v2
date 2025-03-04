export interface IWMSCapabilities {
  version: string
  Service: Service
  Capability: Capability
}

export interface IWMTSCapabilities {
  ServiceIdentification: ServiceIdentification
  ServiceProvider: ServiceProvider
  OperationsMetadata: OperationsMetadata
  version: string
  Contents: Contents
}
interface Capability {
  Request: Request
  Exception: string[]
  Layer: CapabilityLayer
}

interface CapabilityLayer {
  Title: string
  Name: string
  CRS: string[]
  EX_GeographicBoundingBox: number[]
  BoundingBox: BoundingBox[]
  MinScaleDenominator: number
  Layer: LayerElement[]
}

interface BoundingBox {
  crs: string
  extent: number[]
  res: null[]
}

interface LayerElement {
  Name: string
  Title: string
  CRS: string[]
  EX_GeographicBoundingBox: number[]
  BoundingBox: BoundingBox[]
  Style: Style[]
  MinScaleDenominator: number
  queryable: boolean
  cascaded: number
  opaque: boolean
  noSubsets: boolean
  MaxScaleDenominator?: number
}

interface Style {
  Name: string
  Title: string
  LegendURL: LegendURL[]
}

interface LegendURL {
  Format: string
  OnlineResource: string
  size: null[]
}

interface Request {
  GetCapabilities: Get
  GetMap: Get
  GetFeatureInfo: Get
}

interface Get {
  Format: string[]
  DCPType: DCPType[]
}

interface DCPType {
  HTTP: HTTP
}

interface HTTP {
  Get: GetClass
}

interface GetClass {
  OnlineResource: string
}

interface Service {
  Name: string
  Title: string
  KeywordList: string[]
  OnlineResource: string
  Abstract: string
  Fees: string
  AccessConstraints: string
  ContactInformation: ContactInformation
}

interface ContactInformation {
  ContactPersonPrimary: ContactPersonPrimary
}

interface ContactPersonPrimary {
  ContactPerson: string
  ContactOrganization: string
}

interface Contents {
  Layer: Layer[]
  TileMatrixSet: TileMatrixSet[]
}

interface Layer {
  Title: string
  Abstract: string
  WGS84BoundingBox: number[]
  Identifier: string
  Style: Style[]
  Format: string[]
  TileMatrixSetLink: TileMatrixSetLink[]
}

interface Style {
  Title: string
  Identifier: string
  isDefault: boolean
}

interface TileMatrixSetLink {
  TileMatrixSet: string
}

interface TileMatrixSet {
  Identifier: string
  SupportedCRS: string
  TileMatrix: TileMatrix[]
}

interface TileMatrix {
  Identifier: string
  ScaleDenominator: number
  TopLeftCorner: number[]
  TileWidth: number
  TileHeight: number
  MatrixWidth: number
  MatrixHeight: number
}

interface OperationsMetadata {
  GetCapabilities: Get
  GetTile: Get
}

interface Get {
  DCP: Dcp
}

interface Dcp {
  HTTP: HTTP
}

interface HTTP {
  Get: GetElement[]
}

interface GetElement {
  href: string
  Constraint: Constraint[]
}

interface Constraint {
  name: string
  AllowedValues: AllowedValues
}

interface AllowedValues {
  Value: string[]
}

interface ServiceIdentification {
  Title: string
  Abstract: string
  ServiceType: string
  ServiceTypeVersion: string
  Fees: string
  AccessConstraints: string
}

interface ServiceProvider {
  ProviderName: string
  ProviderSite: string
  ServiceContact: ServiceContact
}

interface ServiceContact {
  IndividualName: string
  PositionName: string
  ContactInfo: ContactInfo
}

interface ContactInfo {
  Phone: Phone
  Address: Address
}

interface Address {
  DeliveryPoint: string
  City: string
  AdministrativeArea: string
  PostalCode: string
  Country: string
  ElectronicMailAddress: string
}

interface Phone {
  Voice: string
  Facsimile: string
}
