import { Composition, Folder, Still } from 'remotion';
import { TheBrand } from './TheBrand/TheBrand';
import { videoConfig as theBrandVideoConfig } from './TheBrand/styles/theme';
import { TOTAL_DURATION_FRAMES } from './TheBrand/data';
import { Cerebro, CerebroSquare } from './Cerebro';
import { HowLawFirmRAGWorks, AuthorityAwareRanking } from './Cerebro/clips';
import { sceneDurations, transitionDuration, videoConfig } from './Cerebro/styles/theme';
import { IlluminateHero } from './Cerebro/scenes/IlluminateHero';
import { illuminateConfig } from './Cerebro/styles/illuminate-theme';
import { CerebroExplainer } from './Cerebro/CerebroExplainer';
import { CerebroExplainerV2 } from './Cerebro/CerebroExplainerV2';
import { CerebroExplainerV3 } from './Cerebro/CerebroExplainerV3';
import { xTiming } from './Cerebro/styles/cerebro-explainer-theme';
import { IntroSequence, OutroSequence, QuestionMarks, StatCallout, QuoteCard, QuoteCardV2 } from './BowTie/compositions';
import { CaptionTrack, TelemetryOverlay } from './BowTie/components';
import { YouTubeBanner } from './BowTie/stills/YouTubeBanner';
import {
  introDuration,
  outroDuration,
  videoConfig as bowtieVideoConfig,
  calculateQuoteDuration,
} from './BowTie/styles/bowtie-theme';
import { ReelsRoot } from './Reels/ReelsRoot';
import { VisionSparkHero } from './Ads/VisionSparkHero/VisionSparkHero';
import { TrendPilotReel } from './Ads/TrendPilot/TrendPilotReel';
import { TrendPilotCarousel } from './Ads/TrendPilot/TrendPilotCarousel';
import { TREND_PILOT_VARIANTS, sizes, reelDurations, timing as adTiming } from './Ads';
import { HookReel, hookReelDefaults } from './templates/HookReel';
import { QuoteReel, quoteReelDefaults } from './templates/QuoteReel';
import { ListicleReel, listicleReelDefaults } from './templates/ListicleReel';
import { BRollTextReel, bRollTextReelDefaults } from './templates/BRollTextReel';
import { CoverCard, coverCardDefaults } from './templates/CoverCard';
import { VOReel, voReelDefaults } from './templates/VOReel';
import { LawBookHeppnerDemo, lawBookHeppnerDemoDefaults } from './templates/inn-reels/scenes/LawBookHeppnerDemo';
import {
  S01FiveQuestions,
  S02StackMap,
  S03MerBreakdown,
  S04RoasOverAttr,
  S05KnifeFight,
  S0664Gap,
  S07FourTabAudit,
  S08IdentifierGraph,
  S09FiveLayerSpine,
  S10CanonicalSchema,
  S11EightKpis,
  S12CfoMondayView,
} from './Unsilo';
import { NumberFlash } from './InnovativeNative/patterns/NumberFlash';
import { IconFlash } from './InnovativeNative/patterns/IconFlash';
import { QuoteBurst } from './InnovativeNative/patterns/QuoteBurst';
import { WordFlash } from './InnovativeNative/patterns/WordFlash';
import { BracketHighlight } from './InnovativeNative/patterns/BracketHighlight';
import { BumperFlash } from './InnovativeNative/patterns/BumperFlash';
import { TitleCard, StatCard, CalloutCard, BulletReveal, WorkflowMap, ComparisonSplit } from './InnovativeNative';
import { LowerThird } from './InnovativeNative/LowerThird';
import { EndCard } from './InnovativeNative/EndCard';
import { BarChart } from './InnovativeNative/BarChart';
import { Timeline } from './InnovativeNative/Timeline';
import { ProcessDiagram } from './InnovativeNative/ProcessDiagram';
import { IconGrid } from './InnovativeNative/IconGrid';

/**
 * Calculate total duration accounting for transition overlaps
 *
 * Total scene durations:
 * - Scene 1: 210 frames
 * - Scene 2: 330 frames
 * - Scene 3: 360 frames
 * - Scene 4: 450 frames
 * - Scene 5: 600 frames
 * - Scene 6: 450 frames
 * - Scene 7: 300 frames
 * Total: 2700 frames
 *
 * Transitions: 6 transitions × 15 frames = 90 frames overlap
 * Final duration: 2700 - 90 = 2610 frames (~87 seconds)
 */
const calculateTotalDuration = () => {
  const totalSceneDuration =
    sceneDurations.scene1 +
    sceneDurations.scene2 +
    sceneDurations.scene3 +
    sceneDurations.scene4 +
    sceneDurations.scene5 +
    sceneDurations.scene6 +
    sceneDurations.scene7;

  const numTransitions = 6;
  const totalTransitionOverlap = numTransitions * transitionDuration;

  return totalSceneDuration - totalTransitionOverlap;
};

const TOTAL_DURATION = calculateTotalDuration();

// Dynamic quote durations based on word count (human speech pace)
const DEFAULT_QUOTE_V1 = 'Quote text here.';
const DEFAULT_QUOTE_V2 = 'The **marathon** continues.';
const quoteV1Duration = calculateQuoteDuration(DEFAULT_QUOTE_V1, bowtieVideoConfig.longForm.fps);
const quoteV1DurationShorts = calculateQuoteDuration(DEFAULT_QUOTE_V1, bowtieVideoConfig.shorts.fps);
const quoteV2Duration = calculateQuoteDuration(DEFAULT_QUOTE_V2, bowtieVideoConfig.longForm.fps);
const quoteV2DurationShorts = calculateQuoteDuration(DEFAULT_QUOTE_V2, bowtieVideoConfig.shorts.fps);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Cerebro">
        {/* Main 16:9 composition for website */}
        <Composition
          id="Cerebro"
          component={Cerebro}
          durationInFrames={TOTAL_DURATION}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />

        {/* Square 1:1 composition for social media */}
        <Composition
          id="Cerebro-Square"
          component={CerebroSquare}
          durationInFrames={TOTAL_DURATION}
          fps={videoConfig.fps}
          width={1080}
          height={1080}
        />
        {/* CerebroExplainer: 76.7s narrated product explainer with VO */}
        <Composition
          id="CerebroExplainer"
          component={CerebroExplainer}
          durationInFrames={xTiming.totalFrames}
          fps={xTiming.fps}
          width={xTiming.width}
          height={xTiming.height}
        />

        {/* CerebroExplainerV2: 85s tactical icon-based explainer */}
        <Composition
          id="CerebroExplainerV2"
          component={CerebroExplainerV2}
          durationInFrames={2550}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* CerebroExplainerV3: 80s price/value wedge, comparison-card format */}
        <Composition
          id="CerebroExplainerV3"
          component={CerebroExplainerV3}
          durationInFrames={2400}
          fps={30}
          width={1920}
          height={1080}
        />

        {/* Illuminate: 20-second hero loop at 60fps */}
        <Composition
          id="IlluminateHero"
          component={IlluminateHero}
          durationInFrames={illuminateConfig.durationInFrames}
          fps={illuminateConfig.fps}
          width={illuminateConfig.width}
          height={illuminateConfig.height}
        />
      </Folder>

      {/* Marketing Clips */}
      <Folder name="Clips">
        {/* 30-second clip: How Law Firm RAG Works */}
        <Composition
          id="HowLawFirmRAGWorks"
          component={HowLawFirmRAGWorks}
          durationInFrames={900} // 30 seconds at 30fps
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />

        {/* 15-second clip: Authority-Aware Ranking */}
        <Composition
          id="AuthorityAwareRanking"
          component={AuthorityAwareRanking}
          durationInFrames={450} // 15 seconds at 30fps
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
      </Folder>

      {/* BowTie Bullies — The Aftermath */}
      <Folder name="BowTie">
        {/* YouTube Banner Still (2560x1440) */}
        <Still
          id="BowTieYouTubeBanner"
          component={YouTubeBanner}
          width={2560}
          height={1440}
        />

        {/* Intro: 16:9 long-form (3.5s at 24fps = 84 frames) */}
        <Composition
          id="BowTieIntro"
          component={IntroSequence}
          durationInFrames={introDuration.longForm.totalFrames}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ variant: 'longform' as const }}
        />

        {/* Intro: 9:16 shorts (1.5s at 30fps = 45 frames) */}
        <Composition
          id="BowTieIntroShorts"
          component={IntroSequence}
          durationInFrames={introDuration.shorts.totalFrames}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ variant: 'shorts' as const }}
        />

        {/* Outro: 16:9 long-form (7.0s at 24fps = 168 frames) */}
        <Composition
          id="BowTieOutro"
          component={OutroSequence}
          durationInFrames={outroDuration.longForm.totalFrames}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ variant: 'longform' as const }}
        />

        {/* Outro: 9:16 shorts (3.0s at 30fps = 90 frames) */}
        <Composition
          id="BowTieOutroShorts"
          component={OutroSequence}
          durationInFrames={outroDuration.shorts.totalFrames}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ variant: 'shorts' as const }}
        />

        {/* QuestionMarks: 16:9 overlay for rhetorical segments (5s at 24fps = 120 frames) */}
        <Composition
          id="BowTieQuestionMarks"
          component={QuestionMarks}
          durationInFrames={120}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ variant: 'longform' as const }}
        />

        {/* QuestionMarks: 9:16 overlay for shorts (5s at 30fps = 150 frames) */}
        <Composition
          id="BowTieQuestionMarksShorts"
          component={QuestionMarks}
          durationInFrames={150}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ variant: 'shorts' as const }}
        />

        {/* StatCallout: 16:9 overlay (4s at 24fps = 96 frames) */}
        <Composition
          id="BowTieStatCallout"
          component={StatCallout}
          durationInFrames={96}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ value: 100, label: 'STAT LABEL', variant: 'longform' as const }}
        />

        {/* StatCallout: 9:16 overlay (4s at 30fps = 120 frames) */}
        <Composition
          id="BowTieStatCalloutShorts"
          component={StatCallout}
          durationInFrames={120}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ value: 100, label: 'STAT LABEL', variant: 'shorts' as const }}
        />

        {/* QuoteCard: 16:9 overlay (dynamic duration based on word count) */}
        <Composition
          id="BowTieQuoteCard"
          component={QuoteCard}
          durationInFrames={quoteV1Duration.frames}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ quote: DEFAULT_QUOTE_V1, variant: 'longform' as const }}
        />

        {/* QuoteCard: 9:16 overlay (dynamic duration based on word count) */}
        <Composition
          id="BowTieQuoteCardShorts"
          component={QuoteCard}
          durationInFrames={quoteV1DurationShorts.frames}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ quote: DEFAULT_QUOTE_V1, variant: 'shorts' as const }}
        />

        {/* QuoteCardV2: 16:9 full-screen quote with brush stroke highlights (dynamic) */}
        <Composition
          id="BowTieQuoteCardV2"
          component={QuoteCardV2}
          durationInFrames={quoteV2Duration.frames}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ quote: DEFAULT_QUOTE_V2, variant: 'longform' as const }}
        />

        {/* QuoteCardV2: 9:16 for shorts (dynamic) */}
        <Composition
          id="BowTieQuoteCardV2Shorts"
          component={QuoteCardV2}
          durationInFrames={quoteV2DurationShorts.frames}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ quote: DEFAULT_QUOTE_V2, variant: 'shorts' as const }}
        />

        {/* CaptionTrack: 16:9 (10s at 24fps = 240 frames) */}
        <Composition
          id="BowTieCaptionTrack"
          component={CaptionTrack}
          durationInFrames={240}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{ segments: [], variant: 'longform' as const }}
        />

        {/* CaptionTrack: 9:16 for shorts (10s at 30fps = 300 frames) */}
        <Composition
          id="BowTieCaptionTrackShorts"
          component={CaptionTrack}
          durationInFrames={300}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{ segments: [], variant: 'shorts' as const }}
        />

        {/* TelemetryOverlay: 16:9 (6s at 24fps = 144 frames) */}
        <Composition
          id="BowTieTelemetry"
          component={TelemetryOverlay}
          durationInFrames={144}
          fps={bowtieVideoConfig.longForm.fps}
          width={bowtieVideoConfig.longForm.width}
          height={bowtieVideoConfig.longForm.height}
          defaultProps={{
            title: 'SYS.STATUS',
            rows: [
              { label: 'YEAR', value: '2026' },
              { label: 'STATUS', value: 'ACTIVE' },
            ],
          }}
        />

        {/* TelemetryOverlay: 9:16 for shorts (6s at 30fps = 180 frames) */}
        <Composition
          id="BowTieTelemetryShorts"
          component={TelemetryOverlay}
          durationInFrames={180}
          fps={bowtieVideoConfig.shorts.fps}
          width={bowtieVideoConfig.shorts.width}
          height={bowtieVideoConfig.shorts.height}
          defaultProps={{
            title: 'SYS.STATUS',
            rows: [
              { label: 'YEAR', value: '2026' },
              { label: 'STATUS', value: 'ACTIVE' },
            ],
          }}
        />
      </Folder>

      {/* Instagram Reels - 9:16 vertical text-animation Reels */}
      <ReelsRoot />

      {/* ─── Ads: TrendPilot Reels + Carousel Stills ─── */}
      <Folder name="Ads">
        <Folder name="TrendPilot-Reels">
          {TREND_PILOT_VARIANTS.map((variant, vi) =>
            (['hook', 'authority'] as const).map((reelStyle) => (
              <Composition
                key={`${variant.id}-${reelStyle}`}
                id={`TP-Reel-${reelStyle === 'hook' ? 'Hook' : 'Auth'}-V${vi + 1}`}
                component={TrendPilotReel}
                durationInFrames={reelStyle === 'hook' ? reelDurations.hook : reelDurations.standard}
                fps={adTiming.fps}
                width={sizes.reel.width}
                height={sizes.reel.height}
                defaultProps={{
                  variantIndex: vi,
                  reelStyle,
                }}
              />
            )),
          )}
        </Folder>
        <Folder name="TrendPilot-Carousels">
          {TREND_PILOT_VARIANTS.map((variant, vi) =>
            (['bold', 'feature'] as const).map((carouselStyle) => {
              const slides =
                carouselStyle === 'bold'
                  ? variant.carousel.boldSlides
                  : variant.carousel.featureSlides;
              return slides.map((_slide, si) => (
                <Still
                  key={`${variant.id}-${carouselStyle}-${si}`}
                  id={`TP-Carousel-${carouselStyle === 'bold' ? 'Bold' : 'Feat'}-V${vi + 1}-S${si + 1}`}
                  component={TrendPilotCarousel}
                  width={sizes.carousel.width}
                  height={sizes.carousel.height}
                  defaultProps={{
                    variantIndex: vi,
                    carouselStyle,
                    slideIndex: si,
                  }}
                />
              ));
            }),
          )}
        </Folder>
      </Folder>

      {/* ─── Parametrized Template Library ─── */}
      {/* Brand + safe-zone aware reusable templates for IG Content Factory */}
      <Folder name="Templates">
        <Composition
          id="HookReel"
          component={HookReel}
          durationInFrames={240} // 8s @ 30fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={hookReelDefaults}
        />
        <Composition
          id="QuoteReel"
          component={QuoteReel}
          durationInFrames={180} // 6s @ 30fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={quoteReelDefaults}
        />
        <Composition
          id="ListicleReel"
          component={ListicleReel}
          durationInFrames={360} // 12s @ 30fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={listicleReelDefaults}
        />
        <Composition
          id="BRollTextReel"
          component={BRollTextReel}
          durationInFrames={300} // 10s @ 30fps
          fps={30}
          width={1080}
          height={1920}
          defaultProps={bRollTextReelDefaults}
        />
      </Folder>

      {/* ─── Innovative Native VO Reels (real voiceover from 2026-04-05) ─── */}
      <Folder name="INN-VOReels">
        {/* Reel 01: Scale vs Stretch — 22s */}
        <Composition
          id="INN-Reel-01-Scale-Stretch"
          component={VOReel}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            ...voReelDefaults,
            voSrc: 'vo/inn-native/reel-01-scale-stretch/vo.mp3',
            wordsSrc: 'vo/inn-native/reel-01-scale-stretch/words.json',
            sceneKey: 'scale-stretch' as const,
            signoffFaceSrc: 'br/inn-native/signoff/mike-blazer-warm-smile.png',
            ctaFallback: 'More at theInnovativeNative.com',
          }}
        />

        {/* Reel 02: AI Automation — 22s */}
        <Composition
          id="INN-Reel-02-AI-Automation"
          component={VOReel}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            ...voReelDefaults,
            voSrc: 'vo/inn-native/reel-02-ai-automation/vo.mp3',
            wordsSrc: 'vo/inn-native/reel-02-ai-automation/words.json',
            sceneKey: 'ai-automation' as const,
            signoffFaceSrc: 'br/inn-native/signoff/mike-blazer-warm-smile.png',
            ctaFallback: 'More at theInnovativeNative.com',
          }}
        />

        {/* Reel 03: Numbers + Brand — 22s (re-cut from 27s) */}
        <Composition
          id="INN-Reel-03-Numbers-Brand"
          component={VOReel}
          durationInFrames={750}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            ...voReelDefaults,
            voSrc: 'vo/inn-native/reel-03-numbers-brand/vo.mp3',
            wordsSrc: 'vo/inn-native/reel-03-numbers-brand/words.json',
            sceneKey: 'numbers-brand' as const,
            signoffFaceSrc: 'br/inn-native/signoff/mike-blazer-approachable.png',
            ctaFallback: 'More at theInnovativeNative.com',
          }}
        />

        {/* Law Book Demo — US v. Heppner visual preview (silent, no VO yet) */}
        <Composition
          id="INN-LawBook-Heppner-Demo"
          component={LawBookHeppnerDemo}
          durationInFrames={540}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={lawBookHeppnerDemoDefaults}
        />

        {/* Reel 04: Freedom is a Design Problem — 18s */}
        <Composition
          id="INN-Reel-04-Freedom-Design"
          component={VOReel}
          durationInFrames={540}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            ...voReelDefaults,
            voSrc: 'vo/inn-native/reel-04-freedom-design/vo.mp3',
            wordsSrc: 'vo/inn-native/reel-04-freedom-design/words.json',
            sceneKey: 'freedom-design' as const,
            signoffFaceSrc: 'br/inn-native/signoff/mike-flannel-approachable.png',
            ctaFallback: 'Design problems are solvable',
            signoffDurationInFrames: 93,
          }}
        />
      </Folder>

      {/* ─── Week 1: The Clarity Thesis — 14 data-driven reels ─── */}
      {/* ─── Week 1 Cover Cards (clickbait thumbnails, 1080x1920 PNG stills) ─── */}
      <Folder name="INN-W01-Covers">
        <Still id="Cover-01AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/pexels/week-01/images-pbj/child-spreading-jam-6651156.jpg',hookLine1:'YOUR AI IS',hookLine2:'LYING TO YOU',emoji:'🤯',badge:'THE PB&J TEST',badgeColor:'red' as const,floatingIcons:['🍞','🥜','❓','⚡']}} />
        <Still id="Cover-01PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-01/images/blank-notepad-pen-minimalist-8947775.jpg',hookLine1:'ONE SENTENCE.',hookLine2:'THAT\'S IT.',emoji:'🎯',badge:'THE TEST',floatingIcons:['✍️','💡','⚡']}} />
        <Still id="Cover-02AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/pexels/week-01/images/stack-of-books-education-35972722.jpg',hookLine1:'PROMPT COURSES',hookLine2:'ARE A SCAM',emoji:'💸',badge:'UNPOPULAR OPINION',badgeColor:'red' as const,floatingIcons:['🚫','💰','🧠','🗑️']}} />
        <Still id="Cover-02PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-01/images/stack-of-books-education-35975197.jpg',hookLine1:'I WASTED',hookLine2:'$10K ON COURSES',emoji:'🗑️',badge:'HONEST TAKE',badgeColor:'yellow' as const,floatingIcons:['💸','📚','😤']}} />
        <Still id="Cover-03AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/pexels/week-01/videos/person-typing-laptop-focused-c-7667420.mp4',hookLine1:'YOU\'RE NOT',hookLine2:'SCALING.',emoji:'📉',badge:'HARD TRUTH',badgeColor:'red' as const,floatingIcons:['💀','📊','⚠️','🔥']}} />
        <Still id="Cover-03PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',bgSrc:'br/pexels/week-01/images/compound-interest-growth-chart-6120172.jpg',hookLine1:'3× REVENUE',hookLine2:'ZERO PROGRESS',emoji:'💀',badge:'REAL STORY',badgeColor:'yellow' as const,floatingIcons:['📈','💣','😳']}} />
        <Still id="Cover-04AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/law-firm-rag/hero-library-brain.jpg',hookLine1:'CHATGPT LEAKED',hookLine2:'CLIENT DATA',emoji:'⚠️',badge:'FEDERAL RULING',badgeColor:'red' as const,floatingIcons:['⚖️','🔒','🚨','📋']}} />
        <Still id="Cover-04PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-01/images/clean-code-editor-dark-theme-29445973.jpg',hookLine1:'IT\'S NOT',hookLine2:'THE TOOLS.',emoji:'🧠',badge:'WHAT NOBODY TELLS YOU',floatingIcons:['🔧','💭','⚡']}} />
        <Still id="Cover-05AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/pexels/week-01/images/mirror-reflection-abstract-con-4430393.jpg',hookLine1:'AI IS A',hookLine2:'GENIUS CHILD',emoji:'👶',badge:'GAME CHANGER',floatingIcons:['🧒','🧠','⚡','🎯']}} />
        <Still id="Cover-05PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',bgSrc:'br/pexels/week-01/images/compound-interest-growth-chart-30268012.jpg',hookLine1:'CLARITY',hookLine2:'COMPOUNDS.',emoji:'♾️',badge:'THE LEVERAGE POINT',floatingIcons:['📈','💎','⚡']}} />
        <Still id="Cover-06AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-01/images/project-management-kanban-boar-6592358.jpg',hookLine1:'STOP PROMPTING.',hookLine2:'START BUILDING.',emoji:'🏗️',badge:'PROJECTS > PROMPTS',badgeColor:'yellow' as const,floatingIcons:['🔨','📋','⚡','🧱']}} />
        <Still id="Cover-06PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/pexels/week-01/images/mirror-reflection-abstract-con-31052905.jpg',hookLine1:'AI IS A MIRROR',hookLine2:'WITH A MEGAPHONE',emoji:'📢',badge:'THINK ABOUT THIS',floatingIcons:['🪞','📣','🔊']}} />
        <Still id="Cover-07AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/pexels/week-01/images/compound-interest-growth-chart-6120172.jpg',hookLine1:'10% EFFORT',hookLine2:'5× OUTPUT',emoji:'🔥',badge:'THE MATH',badgeColor:'red' as const,floatingIcons:['📊','💪','🚀','⚡']}} />
        <Still id="Cover-07PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',bgSrc:'br/pexels/week-01/images/project-management-kanban-boar-7439127.jpg',hookLine1:'FREEDOM IS A',hookLine2:'DESIGN PROBLEM',emoji:'🔧',badge:'SOLVABLE',floatingIcons:['✏️','📐','🧩','💡']}} />
      </Folder>

      <Folder name="INN-W01-Clarity">
        <Composition id="W01-01AM-PBJ" component={VOReel} durationInFrames={906} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-01am-pbj-prompts/vo.mp3', wordsSrc:'vo/inn-native/w01-01am-pbj-prompts/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/pexels/week-01/images-pbj/pb-toast-banana-6659686.jpg',startFrame:15,durationFrames:100,dim:0.45},
            {type:'stock',src:'br/pexels/week-01/images-pbj/child-spreading-jam-6651156.jpg',startFrame:115,durationFrames:120,dim:0.45},
            {type:'stock',src:'br/pexels/week-01/images-pbj/hands-spreading-jam-8108036.jpg',startFrame:235,durationFrames:120,dim:0.45},
            {type:'vector',icon:'brain' as const,preset:'twist' as const,size:300,label:'VAGUE = BAD',startFrame:355,durationFrames:140},
            {type:'text',headline:'CLARITY\nCOMPOUNDS.',headlineColor:'cyan' as const,fontSize:130,startFrame:495,durationFrames:120},
            {type:'text',headline:'CONFUSION\nIS EXPENSIVE.',headlineColor:'white' as const,fontSize:100,startFrame:615,durationFrames:216},
          ]}} />
        <Composition id="W01-01PM-OneSentence" component={VOReel} durationInFrames={618} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-01pm-one-sentence-test/vo.mp3', wordsSrc:'vo/inn-native/w01-01pm-one-sentence-test/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'One sentence.',startFrame:15,durationFrames:70},
            {type:'terminal',title:'outcome.txt',lines:['Write the outcome.','One sentence.','Not a paragraph.','Not a brainstorm.','If you can\'t — STOP.'],startFrame:85,durationFrames:200},
            {type:'vector',icon:'target' as const,preset:'slamIn' as const,label:'NO MODEL WILL SAVE YOU.',startFrame:285,durationFrames:258},
          ]}} />
        <Composition id="W01-02AM-PromptCourses" component={VOReel} durationInFrames={872} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-02am-prompt-courses/vo.mp3', wordsSrc:'vo/inn-native/w01-02am-prompt-courses/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Unpopular opinion',startFrame:15,durationFrames:80},
            {type:'stock',src:'br/pexels/week-01/videos/person-typing-laptop-focused-c-7667420.mp4',isVideo:true,startFrame:95,durationFrames:150,dim:0.6},
            {type:'comparison',leftLabel:'PROMPTING',rightLabel:'THINKING',leftSubtext:'$299 courses. Tricks. Libraries.',rightSubtext:'Free. Always has been.',winnerSide:'right' as const,startFrame:245,durationFrames:200},
            {type:'text',headline:'THE SKILL\nIS THINKING.',headlineColor:'cyan' as const,startFrame:445,durationFrames:130},
            {type:'vector',icon:'brain' as const,preset:'pulseGlow' as const,label:'And thinking is free.',startFrame:575,durationFrames:222},
          ]}} />
        <Composition id="W01-02PM-BoughtCourses" component={VOReel} durationInFrames={624} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-02pm-bought-every-course/vo.mp3', wordsSrc:'vo/inn-native/w01-02pm-bought-every-course/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'I bought every course.',startFrame:15,durationFrames:70},
            {type:'stock',src:'br/pexels/week-01/images/stack-of-books-education-35972722.jpg',startFrame:85,durationFrames:140},
            {type:'text',headline:'BETTER PROMPTER.\nWORSE THINKER.',headlineColor:'white' as const,startFrame:225,durationFrames:160},
            {type:'vector',icon:'lightbulb' as const,preset:'zoomIn' as const,label:'Define outcomes. Not prompts.',startFrame:385,durationFrames:164},
          ]}} />
        <Composition id="W01-03AM-Scaling" component={VOReel} durationInFrames={710} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-03am-scaling-stretching/vo.mp3', wordsSrc:'vo/inn-native/w01-03am-scaling-stretching/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Scale ≠ Stretch',startFrame:15,durationFrames:80},
            {type:'comparison',leftLabel:'STRETCH',rightLabel:'SCALE',leftSubtext:'Breaks at 2×.',rightSubtext:'Handles 10×.',winnerSide:'right' as const,startFrame:95,durationFrames:180},
            {type:'stock',src:'br/pexels/week-01/videos/person-typing-laptop-focused-c-7667420.mp4',isVideo:true,startFrame:275,durationFrames:120,dim:0.55},
            {type:'text',headline:'REAL SCALE\nIS QUIET.',headlineColor:'cyan' as const,startFrame:395,durationFrames:100},
            {type:'formula',prefixText:'It feels like',elements:[{text:'Systems',kind:'var' as const},{text:'×',kind:'op' as const},{text:'Quality',kind:'var' as const},{text:'=',kind:'op' as const},{text:'Scale',kind:'result' as const}],startFrame:495,durationFrames:140},
          ]}} />
        <Composition id="W01-03PM-Growth" component={VOReel} durationInFrames={641} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-03pm-growth-structure/vo.mp3', wordsSrc:'vo/inn-native/w01-03pm-growth-structure/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Decay at high speed',startFrame:15,durationFrames:70},
            {type:'reddit',subreddit:'r/Entrepreneur',username:'u/overworked_fo***',title:'We doubled revenue and everything is broken',body:'More money. More chaos. Zero progress.',upvotes:3400,comments:412,timeAgo:'1 month ago',startFrame:85,durationFrames:200},
            {type:'text',headline:'STRUCTURE\nMAKES FREEDOM\nPOSSIBLE.',headlineColor:'cyan' as const,startFrame:285,durationFrames:281},
          ]}} />
        <Composition id="W01-04AM-Privilege" component={VOReel} durationInFrames={816} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-04am-chatgpt-privilege/vo.mp3', wordsSrc:'vo/inn-native/w01-04am-chatgpt-privilege/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/law-firm-rag/hero-library-brain.jpg',startFrame:15,durationFrames:100,dim:0.5},
            {type:'stat',value:69,suffix:'%',label:'of lawyers use consumer AI',startFrame:115,durationFrames:140},
            {type:'terminal',title:'terms-of-service.log',lines:['> data_retention: TRUE','> model_training: TRUE','> third_party_access: TRUE','','PRIVILEGE STATUS: WAIVED'],startFrame:255,durationFrames:200},
            {type:'text',headline:'THAT\'S NOT\nPRIVILEGE.',headlineColor:'cyan' as const,fontSize:110,startFrame:455,durationFrames:100},
            {type:'text',headline:'THAT\'S RISK.',headlineColor:'white' as const,fontSize:140,startFrame:555,durationFrames:186},
          ]}} />
        <Composition id="W01-04PM-Bottleneck" component={VOReel} durationInFrames={426} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-04pm-bottleneck-not-tool/vo.mp3', wordsSrc:'vo/inn-native/w01-04pm-bottleneck-not-tool/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Not the tools.',startFrame:15,durationFrames:70},
            {type:'vector',icon:'brain' as const,preset:'twist' as const,size:400,label:'THE THINKING.',startFrame:85,durationFrames:266},
          ]}} />
        <Composition id="W01-05AM-AIChild" component={VOReel} durationInFrames={878} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-05am-ai-high-iq-child/vo.mp3', wordsSrc:'vo/inn-native/w01-05am-ai-high-iq-child/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'High-IQ child',startFrame:15,durationFrames:80},
            {type:'stock',src:'br/pexels/week-01/videos/child-learning-playing-educati-7343463.mp4',isVideo:true,startFrame:95,durationFrames:150,dim:0.55},
            {type:'terminal',title:'context.yml',lines:['role: operator','brand: innovative-native','tone: direct, no-fluff','sequence: hook → teach → close'],startFrame:245,durationFrames:200},
            {type:'text',headline:'A GENIUS\nWITH NO CONTEXT.',headlineColor:'cyan' as const,startFrame:445,durationFrames:120},
            {type:'vector',icon:'warning' as const,preset:'slamIn' as const,label:'Doing it wrong. Very fast.',startFrame:565,durationFrames:238},
          ]}} />
        <Composition id="W01-05PM-Clarity" component={VOReel} durationInFrames={518} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-05pm-clarity-compounds/vo.mp3', wordsSrc:'vo/inn-native/w01-05pm-clarity-compounds/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'text',headline:'CLARITY\nCOMPOUNDS.',headlineColor:'cyan' as const,fontSize:130,startFrame:15,durationFrames:100},
            {type:'text',headline:'CONFUSION\nIS EXPENSIVE.',headlineColor:'white' as const,fontSize:110,startFrame:115,durationFrames:100},
            {type:'vector',icon:'infinity' as const,preset:'pulseGlow' as const,label:'One sentence changes the output.',startFrame:215,durationFrames:228},
          ]}} />
        <Composition id="W01-06AM-Projects" component={VOReel} durationInFrames={864} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-06am-projects-beat-prompts/vo.mp3', wordsSrc:'vo/inn-native/w01-06am-projects-beat-prompts/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Projects > Prompts',startFrame:15,durationFrames:80},
            {type:'comparison',leftLabel:'PROMPTS',rightLabel:'PROJECTS',leftSubtext:'Primitive. One-shot.',rightSubtext:'Context libraries. Reusable.',winnerSide:'right' as const,startFrame:95,durationFrames:200},
            {type:'terminal',title:'project.yml',lines:['roles: [operator, strategist]','brand_guide: loaded','process_templates: 12','example_outputs: verified'],startFrame:295,durationFrames:200},
            {type:'text',headline:'OUTPUT ×\nTIME ÷',headlineColor:'cyan' as const,startFrame:495,durationFrames:294},
          ]}} />
        <Composition id="W01-06PM-Mirror" component={VOReel} durationInFrames={665} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-06pm-ai-mirror-megaphone/vo.mp3', wordsSrc:'vo/inn-native/w01-06pm-ai-mirror-megaphone/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'A mirror.',startFrame:15,durationFrames:70},
            {type:'comparison',leftLabel:'CONFUSION',rightLabel:'CLARITY',leftSubtext:'Amplified.',rightSubtext:'Amplified.',winnerSide:'right' as const,startFrame:85,durationFrames:180},
            {type:'text',headline:'AI IS A MIRROR\nWITH A\nMEGAPHONE.',headlineColor:'cyan' as const,fontSize:96,startFrame:265,durationFrames:325},
          ]}} />
        <Composition id="W01-07AM-5xMath" component={VOReel} durationInFrames={735} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-07am-5x-math/vo.mp3', wordsSrc:'vo/inn-native/w01-07am-5x-math/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stat',value:10,suffix:'%',label:'more effort on your prompt',fontSize:440,startFrame:15,durationFrames:120},
            {type:'stat',value:5,suffix:'×',label:'better output',fontSize:500,startFrame:135,durationFrames:120},
            {type:'formula',prefixText:'The math nobody tells you',elements:[{text:'1',kind:'num' as const},{text:'sentence',kind:'var' as const},{text:'+',kind:'op' as const},{text:'1',kind:'num' as const},{text:'role',kind:'var' as const},{text:'=',kind:'op' as const},{text:'10×',kind:'result' as const}],startFrame:255,durationFrames:200},
            {type:'text',headline:'THE LEVERAGE\nMOST PEOPLE\nSKIP.',headlineColor:'cyan' as const,fontSize:96,startFrame:455,durationFrames:205},
          ]}} />
        <Composition id="W01-07PM-Freedom" component={VOReel} durationInFrames={709} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w01-07pm-freedom-design/vo.mp3', wordsSrc:'vo/inn-native/w01-07pm-freedom-design/words.json', sceneKey:'data-driven' as const, signoffFaceSrc:'br/inn-native/signoff/mike-flannel-approachable.png', beats:[
            {type:'hook',text:'Freedom = work you chose',startFrame:15,durationFrames:80},
            {type:'stock',src:'br/pexels/week-01/videos/organizing-files-computer-desk-7710418.mp4',isVideo:true,startFrame:95,durationFrames:150,dim:0.5},
            {type:'text',headline:'NOT A DREAM.',headlineColor:'white' as const,fontSize:90,startFrame:245,durationFrames:100},
            {type:'text',headline:'A DESIGN\nPROBLEM.',headlineColor:'cyan' as const,fontSize:120,startFrame:345,durationFrames:120},
            {type:'vector',icon:'gear' as const,preset:'flipZ' as const,label:'SOLVABLE.',startFrame:465,durationFrames:169},
          ]}} />
      </Folder>

      {/* ─── Week 2 Cover Cards ─── */}
      <Folder name="INN-W02-Covers">
        <Still id="Cover-08AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/law-firm-rag/hero-library-brain.jpg',hookLine1:'CHATGPT WAIVED',hookLine2:'PRIVILEGE',emoji:'⚖️',badge:'FEDERAL RULING',badgeColor:'red' as const,floatingIcons:['⚖️','🔒','⚠️','📋']}} />
        <Still id="Cover-08PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-02/images/digital-security-padlock-cyber-5952651.jpg',hookLine1:'CONSUMER vs',hookLine2:'ENTERPRISE',emoji:'🔐',badge:'KNOW THE DIFFERENCE',floatingIcons:['🔓','🏢','⚡']}} />
        <Still id="Cover-09AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/law-firm-rag/hero-library-brain.jpg',hookLine1:'69% OF LAWYERS',hookLine2:"DON'T READ THIS",emoji:'📜',badge:'THE HEPPNER RULING',badgeColor:'red' as const,floatingIcons:['⚖️','📊','🚨','⚠️']}} />
        <Still id="Cover-09PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',bgSrc:'br/pexels/week-02/images/terms-conditions-fine-print-docu-6065099.jpg',hookLine1:'READ THE',hookLine2:'ACTUAL TERMS',emoji:'👀',badge:'BEFORE YOU TYPE',badgeColor:'yellow' as const,floatingIcons:['📋','⚠️','🔍']}} />
        <Still id="Cover-10AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',hookLine1:'17% TO 34%',hookLine2:'HALLUCINATION',emoji:'🤥',badge:'VERIFY EVERYTHING',badgeColor:'red' as const,floatingIcons:['📊','⚠️','❌','✅']}} />
        <Still id="Cover-10PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',hookLine1:'WOULD YOU TRUST',hookLine2:'A FIRST-YEAR?',emoji:'🎓',badge:'THE REAL QUESTION',floatingIcons:['📝','⚠️']}} />
        <Still id="Cover-11AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,bgSrc:'br/law-firm-rag/trust-vault-shield.jpg',hookLine1:'PRIVATE RAG',hookLine2:'vs PUBLIC AI',emoji:'🔒',badge:'SAME SEARCH',badgeColor:'yellow' as const,floatingIcons:['🔐','☁️','⚖️']}} />
        <Still id="Cover-11PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',hookLine1:'WRONG',hookLine2:'QUESTION.',emoji:'❓',badge:'THE ARCHITECTURE',floatingIcons:['🏗️','🔧','💡']}} />
        <Still id="Cover-12AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/law-firm-rag/hero-library-brain.jpg',hookLine1:'$100K IN',hookLine2:'SANCTIONS',emoji:'💰',badge:'AI MISUSE',badgeColor:'red' as const,floatingIcons:['⚖️','💸','🚨']}} />
        <Still id="Cover-12PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',hookLine1:'YOUR INSURANCE',hookLine2:"WON'T COVER IT",emoji:'🛡️',badge:'THE EXCLUSION',badgeColor:'yellow' as const,floatingIcons:['📋','❌','⚠️']}} />
        <Still id="Cover-13AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,hookLine1:'47% HAVE',hookLine2:'ZERO POLICY',emoji:'📊',badge:'OPEN DOOR',badgeColor:'red' as const,floatingIcons:['🚪','⚠️','📊']}} />
        <Still id="Cover-13PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-black-tee-neutral.png',hookLine1:'EVERY DESK.',hookLine2:'EVERY ATTORNEY.',emoji:'🏢',badge:'UNCONTROLLED RISK',badgeColor:'red' as const,floatingIcons:['⚠️','💣']}} />
        <Still id="Cover-14AM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-blazer-approachable.png',bgSrc:'br/law-firm-rag/rag-flow-diagram.jpg',hookLine1:'WHY I BUILT',hookLine2:'CEREBRO',emoji:'🧠',badge:'THE ENTIRE POINT',floatingIcons:['🔒','⚖️','💡']}} />
        <Still id="Cover-14PM" component={CoverCard} width={1080} height={1920} defaultProps={{...coverCardDefaults,faceSrc:'br/inn-native/signoff/mike-flannel-approachable.png',hookLine1:'SOMEONE HAS TO',hookLine2:'BUILD IT RIGHT',emoji:'🔧',badge:"THAT'S WHAT I'M DOING",floatingIcons:['💡','🏗️','🔥']}} />
      </Folder>

      {/* ─── Week 2: The Privilege Crisis — 14 data-driven reels ─── */}
      <Folder name="INN-W02-Privilege">
        <Composition id="W02-08AM-Privilege" component={VOReel} durationInFrames={597} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-08am-privilege/vo.mp3', wordsSrc:'vo/inn-native/w02-08am-privilege/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/law-firm-rag/hero-library-brain.jpg',startFrame:15,durationFrames:120,dim:0.5},
            {type:'stat',value:69,suffix:'%',label:'of lawyers use consumer AI',startFrame:135,durationFrames:130},
            {type:'text',headline:'NOT PRIVILEGE.\nPUBLIC FILING.',headlineColor:'cyan' as const,fontSize:110,startFrame:265,durationFrames:242},
          ]}} />
        <Composition id="W02-08PM-NotAllAI" component={VOReel} durationInFrames={587} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-08pm-not-all-ai/vo.mp3', wordsSrc:'vo/inn-native/w02-08pm-not-all-ai/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'comparison',leftLabel:'CONSUMER',rightLabel:'ENTERPRISE',leftSubtext:'Logs. Trains. Shares.',rightSubtext:'Stays inside your walls.',winnerSide:'right' as const,startFrame:15,durationFrames:220},
            {type:'text',headline:'A GAMBLE\nWITH CLIENT DATA.',headlineColor:'white' as const,fontSize:100,startFrame:235,durationFrames:262},
          ]}} />
        <Composition id="W02-09AM-Heppner" component={VOReel} durationInFrames={793} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-09am-heppner-explained/vo.mp3', wordsSrc:'vo/inn-native/w02-09am-heppner-explained/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/law-firm-rag/hero-library-brain.jpg',startFrame:15,durationFrames:130,dim:0.5},
            {type:'terminal',title:'terms-of-service.log',lines:['data_retention: TRUE','model_training: TRUE','sharing: ALLOWED','','STATUS: NOT PROTECTED'],startFrame:145,durationFrames:200},
            {type:'stat',value:69,suffix:'%',label:'never read the terms',startFrame:345,durationFrames:130},
            {type:'text',headline:'GOVERNANCE\nFAILURE.',headlineColor:'cyan' as const,fontSize:120,startFrame:475,durationFrames:228},
          ]}} />
        <Composition id="W02-09PM-ReadTOS" component={VOReel} durationInFrames={566} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-09pm-read-tos/vo.mp3', wordsSrc:'vo/inn-native/w02-09pm-read-tos/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'terminal',title:'terms-of-service.txt',lines:['Section 4.2:','\"We may use your inputs','to improve our models.\"','','⚠️  PRIVILEGE: WAIVED'],startFrame:15,durationFrames:220},
            {type:'text',headline:'YOU JUST\nPUBLISHED IT.',headlineColor:'white' as const,fontSize:110,startFrame:235,durationFrames:241},
          ]}} />
        <Composition id="W02-10AM-Hallucinations" component={VOReel} durationInFrames={641} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-10am-hallucination-rates/vo.mp3', wordsSrc:'vo/inn-native/w02-10am-hallucination-rates/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stat',value:70,suffix:'%',label:'LexisNexis hallucination rate',fontSize:400,startFrame:15,durationFrames:140},
            {type:'stat',value:34,suffix:'%',label:'Westlaw hallucination rate',fontSize:400,startFrame:155,durationFrames:140},
            {type:'text',headline:'VERIFY EVERY\nCITATION.',headlineColor:'cyan' as const,fontSize:120,startFrame:295,durationFrames:256},
          ]}} />
        <Composition id="W02-10PM-FirstYear" component={VOReel} durationInFrames={590} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-10pm-trust-first-year/vo.mp3', wordsSrc:'vo/inn-native/w02-10pm-trust-first-year/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'vector',icon:'warning' as const,preset:'slamIn' as const,size:300,label:'70% HALLUCINATION RATE',startFrame:15,durationFrames:200},
            {type:'text',headline:'IT ADDS\nTO YOUR WORK.',headlineColor:'white' as const,fontSize:110,startFrame:215,durationFrames:285},
          ]}} />
        <Composition id="W02-11AM-PrivateRAG" component={VOReel} durationInFrames={839} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-11am-private-rag/vo.mp3', wordsSrc:'vo/inn-native/w02-11am-private-rag/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/law-firm-rag/trust-vault-shield.jpg',startFrame:15,durationFrames:150,dim:0.5},
            {type:'comparison',leftLabel:'PUBLIC AI',rightLabel:'PRIVATE RAG',leftSubtext:'Logged. Shared. Trained on.',rightSubtext:'Your data. Your walls.',winnerSide:'right' as const,startFrame:165,durationFrames:250},
            {type:'stock',src:'br/law-firm-rag/rag-flow-diagram.jpg',startFrame:415,durationFrames:150,dim:0.45},
            {type:'text',headline:'SAME SEARCH.\nDIFFERENT\nLIABILITY.',headlineColor:'cyan' as const,fontSize:100,startFrame:565,durationFrames:184},
          ]}} />
        <Composition id="W02-11PM-Architecture" component={VOReel} durationInFrames={856} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-11pm-architecture-story/vo.mp3', wordsSrc:'vo/inn-native/w02-11pm-architecture-story/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'hook',text:'Wrong question.',startFrame:15,durationFrames:80},
            {type:'vector',icon:'network' as const,preset:'twist' as const,size:300,label:'WHERE DOES YOUR DATA GO?',startFrame:95,durationFrames:220},
            {type:'terminal',title:'architecture.yml',lines:['question: which tool?  ← WRONG','question: where does data go?  ← RIGHT','','privilege: f(architecture)','efficiency: f(architecture)'],startFrame:315,durationFrames:250},
            {type:'text',headline:'THE TOOL\nDOESN\'T MATTER.',headlineColor:'white' as const,fontSize:100,startFrame:565,durationFrames:201},
          ]}} />
        <Composition id="W02-12AM-Sanctions" component={VOReel} durationInFrames={655} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-12am-100k-sanctions/vo.mp3', wordsSrc:'vo/inn-native/w02-12am-100k-sanctions/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stat',value:100,suffix:'K+',label:'in sanctions for AI misuse',fontSize:380,startFrame:15,durationFrames:160},
            {type:'stock',src:'br/pexels/week-02/videos/reading-document-scroll-close--8655888.mp4',isVideo:true,startFrame:175,durationFrames:150,dim:0.55},
            {type:'text',headline:'ANTI-CARELESS.\nNOT ANTI-AI.',headlineColor:'cyan' as const,fontSize:110,startFrame:325,durationFrames:240},
          ]}} />
        <Composition id="W02-12PM-Insurance" component={VOReel} durationInFrames={609} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-12pm-insurance-wont-cover/vo.mp3', wordsSrc:'vo/inn-native/w02-12pm-insurance-wont-cover/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'vector',icon:'shield' as const,preset:'flipY' as const,size:280,label:'THE EXCLUSION YOU MISSED',startFrame:15,durationFrames:180},
            {type:'text',headline:'AI ISN\'T\nTHE RISK.',headlineColor:'white' as const,fontSize:120,startFrame:195,durationFrames:120},
            {type:'text',headline:'SKIPPING\nVERIFICATION IS.',headlineColor:'cyan' as const,fontSize:110,startFrame:315,durationFrames:204},
          ]}} />
        <Composition id="W02-13AM-47Percent" component={VOReel} durationInFrames={774} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-13am-47-percent/vo.mp3', wordsSrc:'vo/inn-native/w02-13am-47-percent/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stat',value:47,suffix:'%',label:'zero AI governance policy',fontSize:420,startFrame:15,durationFrames:150},
            {type:'terminal',title:'audit.log',lines:['usage_guidelines: NONE','approved_tools: NONE','audit_trail: NONE','','STATUS: OPEN DOOR'],startFrame:165,durationFrames:220},
            {type:'text',headline:'NOT\nOPTIONAL\nANYMORE.',headlineColor:'cyan' as const,fontSize:120,startFrame:385,durationFrames:299},
          ]}} />
        <Composition id="W02-13PM-PolicyGap" component={VOReel} durationInFrames={544} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-13pm-policy-gap/vo.mp3', wordsSrc:'vo/inn-native/w02-13pm-policy-gap/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'vector',icon:'warning' as const,preset:'buzz' as const,size:280,label:'UNCONTROLLED RISK',startFrame:15,durationFrames:180},
            {type:'text',headline:'EVERY DESK.\nEVERY ATTORNEY.',headlineColor:'white' as const,fontSize:100,startFrame:195,durationFrames:259},
          ]}} />
        <Composition id="W02-14AM-Cerebro" component={VOReel} durationInFrames={745} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-14am-why-cerebro/vo.mp3', wordsSrc:'vo/inn-native/w02-14am-why-cerebro/words.json', sceneKey:'data-driven' as const, beats:[
            {type:'stock',src:'br/law-firm-rag/hero-library-brain.jpg',startFrame:15,durationFrames:140,dim:0.45},
            {type:'stock',src:'br/law-firm-rag/rag-flow-diagram.jpg',startFrame:155,durationFrames:180,dim:0.45},
            {type:'text',headline:'NOT A\nFEATURE.',headlineColor:'white' as const,fontSize:120,startFrame:335,durationFrames:120},
            {type:'text',headline:'THE ENTIRE\nPOINT.',headlineColor:'cyan' as const,fontSize:130,startFrame:455,durationFrames:200},
          ]}} />
        <Composition id="W02-14PM-Building" component={VOReel} durationInFrames={590} fps={30} width={1080} height={1920}
          defaultProps={{...voReelDefaults, voSrc:'vo/inn-native/w02-14pm-building-what-i-wish/vo.mp3', wordsSrc:'vo/inn-native/w02-14pm-building-what-i-wish/words.json', sceneKey:'data-driven' as const, signoffFaceSrc:'br/inn-native/signoff/mike-flannel-approachable.png', beats:[
            {type:'stock',src:'br/pexels/week-02/videos/person-working-late-laptop-nig-5483083.mp4',isVideo:true,startFrame:15,durationFrames:200,dim:0.55},
            {type:'vector',icon:'lightbulb' as const,preset:'pulseGlow' as const,size:280,label:'SOMEONE NEEDS TO BUILD IT RIGHT.',startFrame:215,durationFrames:285},
          ]}} />
      </Folder>

      {/* Individual scenes for testing/preview */}
      <Folder name="Scenes">
        <Composition
          id="Scene1-Hook"
          component={require('./Cerebro/scenes').Scene1Hook}
          durationInFrames={sceneDurations.scene1}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene2-Problem"
          component={require('./Cerebro/scenes').Scene2Problem}
          durationInFrames={sceneDurations.scene2}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene3-Solution"
          component={require('./Cerebro/scenes').Scene3Solution}
          durationInFrames={sceneDurations.scene3}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene4-Lanes"
          component={require('./Cerebro/scenes').Scene4Lanes}
          durationInFrames={sceneDurations.scene4}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene5-Agents"
          component={require('./Cerebro/scenes').Scene5Agents}
          durationInFrames={sceneDurations.scene5}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene6-Outcome"
          component={require('./Cerebro/scenes').Scene6Outcome}
          durationInFrames={sceneDurations.scene6}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
        <Composition
          id="Scene7-CTA"
          component={require('./Cerebro/scenes').Scene7CTA}
          durationInFrames={sceneDurations.scene7}
          fps={videoConfig.fps}
          width={videoConfig.width}
          height={videoConfig.height}
        />
      </Folder>

      {/* ─── THE BRAND — Documentary ─── */}
      <Folder name="TheBrand">
        <Composition
          id="TheBrand"
          component={TheBrand}
          durationInFrames={TOTAL_DURATION_FRAMES} // 58:00 at 30fps (104,400 frames)
          fps={theBrandVideoConfig.fps}
          width={theBrandVideoConfig.width}
          height={theBrandVideoConfig.height}
        />
      </Folder>

      {/* ─── Unsilo: How to Unf*ck Your Data — Marketing Blueprint ─── */}
      {/* Transparent overlays for face-cam B-roll compositing. 180f = 6s @ 30fps. */}
      <Folder name="Unsilo">
        <Composition id="Unsilo-S01-16x9" component={S01FiveQuestions} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S01-9x16" component={S01FiveQuestions} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S02-16x9" component={S02StackMap} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S02-9x16" component={S02StackMap} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S03-16x9" component={S03MerBreakdown} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S03-9x16" component={S03MerBreakdown} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S04-16x9" component={S04RoasOverAttr} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S04-9x16" component={S04RoasOverAttr} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S05-16x9" component={S05KnifeFight} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S05-9x16" component={S05KnifeFight} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S06-16x9" component={S0664Gap} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S06-9x16" component={S0664Gap} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S07-16x9" component={S07FourTabAudit} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S07-9x16" component={S07FourTabAudit} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S08-16x9" component={S08IdentifierGraph} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S08-9x16" component={S08IdentifierGraph} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S09-16x9" component={S09FiveLayerSpine} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S09-9x16" component={S09FiveLayerSpine} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S10-16x9" component={S10CanonicalSchema} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S10-9x16" component={S10CanonicalSchema} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S11-16x9" component={S11EightKpis} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S11-9x16" component={S11EightKpis} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Unsilo-S12-16x9" component={S12CfoMondayView} durationInFrames={180} fps={30} width={1920} height={1080} />
        <Composition id="Unsilo-S12-9x16" component={S12CfoMondayView} durationInFrames={180} fps={30} width={1080} height={1920} />
      </Folder>

      {/* ─── Innovative Native Pattern Interrupts (16:9 only, 30fps) ─── */}
      <Folder name="InnovativeNative-Patterns">
        <Composition
          id="Pattern-NumberFlash-16x9"
          component={NumberFlash}
          durationInFrames={45}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ value: '300%', label: 'reported ROAS' }}
        />
        <Composition
          id="Pattern-IconFlash-16x9"
          component={IconFlash}
          durationInFrames={45}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ icon: 'icons/techsy/stripe.png', label: 'Stripe' }}
        />
        <Composition
          id="Pattern-QuoteBurst-16x9"
          component={QuoteBurst}
          durationInFrames={75}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ text: 'Clarity compounds.', emphasis: 'compounds' }}
        />
        <Composition
          id="Pattern-WordFlash-16x9"
          component={WordFlash}
          durationInFrames={30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ word: 'SCALE', position: 'center' }}
        />
        <Composition
          id="Pattern-BracketHighlight-16x9"
          component={BracketHighlight}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ x: 760, y: 390, width: 400, height: 300, color: 'cyan' }}
        />
        <Composition
          id="Pattern-BumperFlash-16x9"
          component={BumperFlash}
          durationInFrames={30}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ direction: 'left' }}
        />
      </Folder>

      {/* ─── InnovativeNative Explainer Templates ─── */}
      <Folder name="InnovativeNative">
        <Composition id="TIN-TitleCard-16x9" component={TitleCard} durationInFrames={180} fps={30} width={1920} height={1080}
          defaultProps={{ title: 'The Gap Nobody Talks About', subtitle: 'Why your marketing numbers never match', eyebrow: 'Chapter 1' }} />
        <Composition id="TIN-TitleCard-9x16" component={TitleCard} durationInFrames={180} fps={30} width={1080} height={1920}
          defaultProps={{ title: 'The Gap Nobody Talks About', subtitle: 'Why your marketing numbers never match', eyebrow: 'Chapter 1' }} />

        <Composition id="TIN-StatCard-16x9" component={StatCard} durationInFrames={180} fps={30} width={1920} height={1080}
          defaultProps={{ value: '64%', label: 'gap between marketing and revops counts', footnote: 'vs reported numbers' }} />
        <Composition id="TIN-StatCard-9x16" component={StatCard} durationInFrames={180} fps={30} width={1080} height={1920}
          defaultProps={{ value: '64%', label: 'gap between marketing and revops counts', footnote: 'vs reported numbers' }} />

        <Composition id="TIN-CalloutCard-16x9" component={CalloutCard} durationInFrames={180} fps={30} width={1920} height={1080}
          defaultProps={{ text: 'Clarity compounds. Confusion is expensive.', attribution: '— The Innovative Native' }} />
        <Composition id="TIN-CalloutCard-9x16" component={CalloutCard} durationInFrames={180} fps={30} width={1080} height={1920}
          defaultProps={{ text: 'Clarity compounds. Confusion is expensive.', attribution: '— The Innovative Native' }} />

        <Composition id="TIN-BulletReveal-16x9" component={BulletReveal} durationInFrames={240} fps={30} width={1920} height={1080}
          defaultProps={{ title: 'Why the data is broken', items: ['Marketing and revops use different attribution windows', 'Ad platforms count clicks, not customers', 'No canonical identifier links the stacks', 'Reports are built on estimates'] }} />
        <Composition id="TIN-BulletReveal-9x16" component={BulletReveal} durationInFrames={240} fps={30} width={1080} height={1920}
          defaultProps={{ title: 'Why the data is broken', items: ['Marketing and revops use different attribution windows', 'Ad platforms count clicks, not customers', 'No canonical identifier links the stacks', 'Reports are built on estimates'] }} />

        <Composition id="TIN-WorkflowMap-16x9" component={WorkflowMap} durationInFrames={240} fps={30} width={1920} height={1080}
          defaultProps={{ steps: [{ n: 1, label: 'Audit your stack' }, { n: 2, label: 'Define canonical IDs' }, { n: 3, label: 'Unify attribution windows' }, { n: 4, label: 'Ship the MER dashboard' }] }} />
        <Composition id="TIN-WorkflowMap-9x16" component={WorkflowMap} durationInFrames={240} fps={30} width={1080} height={1920}
          defaultProps={{ steps: [{ n: 1, label: 'Audit your stack' }, { n: 2, label: 'Define canonical IDs' }, { n: 3, label: 'Unify attribution windows' }, { n: 4, label: 'Ship the MER dashboard' }] }} />

        <Composition id="TIN-ComparisonSplit-16x9" component={ComparisonSplit} durationInFrames={210} fps={30} width={1920} height={1080}
          defaultProps={{ left: { label: 'Marketing claims', value: '$4.2 ROAS' }, right: { label: 'Finance sees', value: '1.8 MER' }, vs: 'VS' }} />
        <Composition id="TIN-ComparisonSplit-9x16" component={ComparisonSplit} durationInFrames={210} fps={30} width={1080} height={1920}
          defaultProps={{ left: { label: 'Marketing claims', value: '$4.2 ROAS' }, right: { label: 'Finance sees', value: '1.8 MER' }, vs: 'VS' }} />

        <Composition id="TIN-LowerThird-16x9" component={LowerThird} durationInFrames={150} fps={30} width={1920} height={1080}
          defaultProps={{ name: 'Mike Larabie', title: 'Founder, The Innovative Native' }} />
        <Composition id="TIN-LowerThird-9x16" component={LowerThird} durationInFrames={150} fps={30} width={1080} height={1920}
          defaultProps={{ name: 'Mike Larabie', title: 'Founder, The Innovative Native' }} />

        <Composition id="TIN-EndCard-16x9" component={EndCard} durationInFrames={240} fps={30} width={1920} height={1080}
          defaultProps={{ showSubscribe: true }} />
        <Composition id="TIN-EndCard-9x16" component={EndCard} durationInFrames={240} fps={30} width={1080} height={1920}
          defaultProps={{ showSubscribe: true }} />

        <Composition id="TIN-BarChart-16x9" component={BarChart} durationInFrames={240} fps={30} width={1920} height={1080}
          defaultProps={{ title: 'Revenue by Channel', bars: [{ label: 'Organic', v: 42 }, { label: 'Paid', v: 78 }, { label: 'Email', v: 31 }, { label: 'Referral', v: 55 }], unit: 'K' }} />
        <Composition id="TIN-BarChart-9x16" component={BarChart} durationInFrames={240} fps={30} width={1080} height={1920}
          defaultProps={{ title: 'Revenue by Channel', bars: [{ label: 'Organic', v: 42 }, { label: 'Paid', v: 78 }, { label: 'Email', v: 31 }, { label: 'Referral', v: 55 }], unit: 'K' }} />

        <Composition id="TIN-Timeline-16x9" component={Timeline} durationInFrames={240} fps={30} width={1920} height={1080}
          defaultProps={{ events: [{ date: 'Q1 2024', label: 'Audit' }, { date: 'Q2 2024', label: 'Systems' }, { date: 'Q3 2024', label: 'Launch' }, { date: 'Q4 2024', label: 'Scale' }] }} />
        <Composition id="TIN-Timeline-9x16" component={Timeline} durationInFrames={240} fps={30} width={1080} height={1920}
          defaultProps={{ events: [{ date: 'Q1 2024', label: 'Audit' }, { date: 'Q2 2024', label: 'Systems' }, { date: 'Q3 2024', label: 'Launch' }, { date: 'Q4 2024', label: 'Scale' }] }} />

        <Composition id="TIN-ProcessDiagram-16x9" component={ProcessDiagram} durationInFrames={210} fps={30} width={1920} height={1080}
          defaultProps={{ input: 'Raw Data', transform: 'AI Automation', output: 'Clear Insight', inputLabel: 'Input', transformLabel: 'Process', outputLabel: 'Output' }} />
        <Composition id="TIN-ProcessDiagram-9x16" component={ProcessDiagram} durationInFrames={210} fps={30} width={1080} height={1920}
          defaultProps={{ input: 'Raw Data', transform: 'AI Automation', output: 'Clear Insight', inputLabel: 'Input', transformLabel: 'Process', outputLabel: 'Output' }} />

        <Composition id="TIN-IconGrid-16x9" component={IconGrid} durationInFrames={210} fps={30} width={1920} height={1080}
          defaultProps={{ title: 'The Stack', items: [{ icon: 'assets/icon-placeholder.png', label: 'Airtable' }, { icon: 'assets/icon-placeholder.png', label: 'n8n' }, { icon: 'assets/icon-placeholder.png', label: 'Supabase' }, { icon: 'assets/icon-placeholder.png', label: 'Remotion' }, { icon: 'assets/icon-placeholder.png', label: 'Brevo' }, { icon: 'assets/icon-placeholder.png', label: 'Stripe' }] }} />
        <Composition id="TIN-IconGrid-9x16" component={IconGrid} durationInFrames={210} fps={30} width={1080} height={1920}
          defaultProps={{ title: 'The Stack', items: [{ icon: 'assets/icon-placeholder.png', label: 'Airtable' }, { icon: 'assets/icon-placeholder.png', label: 'n8n' }, { icon: 'assets/icon-placeholder.png', label: 'Supabase' }, { icon: 'assets/icon-placeholder.png', label: 'Remotion' }, { icon: 'assets/icon-placeholder.png', label: 'Brevo' }, { icon: 'assets/icon-placeholder.png', label: 'Stripe' }] }} />
      </Folder>

      <Folder name="VisionSpark">
        <Composition
          id="VisionSparkHero"
          component={VisionSparkHero}
          durationInFrames={1800}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
